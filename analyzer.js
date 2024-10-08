import { analyzeText } from './analyzeText.js';
import { showDefinition as importedShowDefinition } from './showDefinition.js';
import { getGrammarExplanation } from './grammarExplanation.js';

window.showDefinition = importedShowDefinition;


document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');

    const analyzeButton = document.getElementById('analyzeButton');
    const explainButton = document.getElementById('explainButton');
    const clearButton = document.getElementById('clearButton');

    const parsedWordsElement = document.getElementById('parsedResult');
    const wordDefinitionsElement = document.getElementById('definitionsResult');
    const translationElement = document.getElementById('translationResult');
    const explanationElement = document.getElementById('analysisResult');

    clearButton.addEventListener('click',() =>{
        inputText.value = '';
        translationElement.textContent= '';
        explanationElement.textContent= '';

        // Remove Parse and Word Defs
        while (parsedWordsElement.firstChild) {
            parsedWordsElement.removeChild(parsedWordsElement.firstChild);
    }
        while (wordDefinitionsElement.firstChild){
            wordDefinitionsElement.removeChild(wordDefinitionsElement.firstChild);
        }

    })

    explainButton.addEventListener('click', () => {
        getGrammarExplanation(inputText.value,explanationElement)
    })

    analyzeButton.addEventListener('click', () => {
        analyzeText(inputText.value, parsedWordsElement, translationElement, explanationElement);
    });
});