function showDefinition(surface, reading, baseForm, pos) {
    
    if (isAlreadyDefined(surface)) {
        console.log("Word already defined:", surface);
        return; // Exit the function if the word is already defined
    }

    fetch(`/jisho_proxy?keyword=${encodeURIComponent(surface)}`)
        .then(response => response.json())
        .then(data => {
            console.log("Data received from backend:", data);
            
            const definitionsDiv = document.getElementById('definitionsResult');
            const definitionElement = document.createElement('div');
            
            let jishoInfo = getJishoInfo(data);
            
            definitionElement.innerHTML = `
                <strong>${surface}</strong><br>
                Base form: ${baseForm}<br>
                ${jishoInfo}<br><br>`;
            definitionElement.setAttribute('data-word', surface);
            definitionsDiv.appendChild(definitionElement);
        })
        .catch(error => console.error('Error:', error));
}

function isAlreadyDefined(word){
    const definitionsDiv = document.getElementById('wordDefinitions');
    const existingDefinitions = definitionsDiv.querySelectorAll(`[data-word="${word}"]`);
    return existingDefinitions.length > 0;
}

function getJishoInfo(jishoData) {
    if (!jishoData.data || jishoData.data.length === 0) {
        console.log("No data returned from Jisho API");
        return "No Jisho data found";
    }

    const firstResult = jishoData.data[0];
    
    // Get all readings
    const readings = firstResult.japanese
        .map(item => `${item.word || ''} (${item.reading || ''})`)
        .filter(reading => reading !== ' ()') // Remove empty readings
        .join(', ');

    // Get all senses with parts of speech and definitions
    const sensesInfo = firstResult.senses.map((sense, index) => {
        const pos = sense.parts_of_speech.join(', ') || 'N/A';
        const definitions = sense.english_definitions.join(', ');
        return `${index + 1}. (${pos}) ${definitions}`;
    }).join('<br>');

    return `
        Readings: ${readings}<br>
        Definitions:<br>${sensesInfo}
    `;
}

export { showDefinition };