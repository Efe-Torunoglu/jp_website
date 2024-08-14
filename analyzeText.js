async function analyzeText(inputText, uniqueWordsElement,translationElement, explanationElement){
    try {
        const response = await fetch('/analyzer', {
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

        uniqueWordsElement.textContent = ''; // TODO
        translationElement.textContent = data.translation;
        explanationElement.innerHTML= data.explanation; 
    }
    catch(error){
        console.error('Error' , error);
        alert('An error occurred while analyzing the text. Please try again.');
    }
}

export { analyzeText };