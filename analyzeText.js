async function analyzeText(inputText, parsedWordsElement,translationElement, explanationElement){
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

        parsedWordsElement.innerHTML = data.parsedwords.map(word=>
           `<span class="word" onclick="showDefinition('${word.surface}', 
           '${word.reading}', 
           '${word.base_form}', 
           '${word.pos}')"> ${word.surface}</span>`).join(' - '); 
        translationElement.textContent = data.translation;
        explanationElement.innerHTML= data.explanation; 
    }
    catch(error){
        console.error('Error' , error);
        alert('An error occurred while analyzing the text. Please try again.');
    }
}



export { analyzeText };