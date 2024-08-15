import os
from flask import Flask, request, jsonify, send_from_directory
import requests
from dotenv import load_dotenv
from anthropic import Anthropic
import re
from janome.tokenizer import Tokenizer


load_dotenv() 

app = Flask(__name__, static_url_path='', static_folder='.')
t = Tokenizer()

DEEPL_API_KEY = os.getenv('DEEPL_API_KEY')
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/jisho_proxy')
def jisho_proxy():
    keyword = request.args.get('keyword')
    response = requests.get(f'https://jisho.org/api/v1/search/words?keyword={keyword}')
    return jsonify(response.json())

def tokenize(text):
    tokens = t.tokenize(text)
    words = [token.surface for token in tokens]
    return words

def tokenize_complete(text):
    tokens = t.tokenize(text)
    words = [{
        'surface': token.surface,
        'reading': token.reading,
        'base_form': token.base_form,
        'pos': token.part_of_speech.split(',')[0]
    } for token in tokens] 

    return words

@app.route('/grammarExplanation', methods = ['POST'])
def getGrammarExplanation():
    data = request.json
    japanese_text = data.get('text' ,'')

    prompt = f"""
        Analyze the following Japanese text and its English translation:

        Do not say anything like Certainly, I'd be happy to. Make the analysis read like a dry scientific paper.

        Japanese: {japanese_text}

        Do not provide an English Translation of this sentence. 

        Do not say anything before Particles and their functions. Go immedeatly into the analysis.

        Provide a grammatical explanation of this text, paying special attention to:
        1. Particles used and their functions, make sure to especially explain rarer particles or particles being used in odd ways. 
            If wa and ga are used in the same sentence, explain the nuance between the two in that sentence. 
        2. Verb tenses and their implications
        3. Any complex grammatical structures or complex sentence structures.
        4. Nuances that might be lost in translation

        Please structure your response in a clear, easy-to-understand format, using bullet points and line breaks.
        Most importantly, do not, under any circumstance use romanji, for kanji readings use furigana.
        Furthermore, do not say certainly at the beginning and do not act like an agent. Present the information plainly.
    """
    
    claude_response = anthropic.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=1000,
        system="You are a helpful assistant that specializes in Japanese language and grammar.",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    explanation = claude_response.content[0].text
    explanation = explanation.replace('\n\n', '</p><p>').replace('\n', '<br>')
    explanation = f'<p>{explanation}</p>'

    return jsonify({
        'explanation':explanation
    })

@app.route('/analyzer', methods = ['POST'])
def analyze():
    data = request.json
    japanese_text = data.get('text' ,'')

    # Deepl Section: 
    deepl_response = requests.post(
        'https://api-free.deepl.com/v2/translate',
                headers={'Authorization': f'DeepL-Auth-Key {DEEPL_API_KEY}'},
        data={
            'text': japanese_text,
            'target_lang': 'EN'
        }
    )
    translation = deepl_response.json()['translations'][0]['text']
    complete_parsed_words = tokenize_complete(japanese_text)

    return jsonify({
        'parsedwords': complete_parsed_words,
        'translation': translation,
    })


#if __name__ == '__main__':
   # app.run(debug=True)