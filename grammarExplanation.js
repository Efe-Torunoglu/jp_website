async function getGrammarExplanation(inputText, explanationElement){
    try {
        const response = await fetch('/grammarExplanation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: inputText }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        explanationElement.innerHTML= data.explanation; 
    }
    catch(error){
        console.error('Error' , error);
        alert('An error occurred while analyzing the text. Please try again.');
    }
}
export {getGrammarExplanation}