function getJishoReading(jishoData) {
    const firstResult = jishoData.data?.[0];
    if (!firstResult) return 'No data found';

    const readings = firstResult.japanese
        .map(item => `${item.word || ''} (${item.reading || ''})`)
        .join(', ');

    const sensesInfo = firstResult.senses.map((sense, index) => {
        const pos = sense.parts_of_speech.join(', ');
        const definitions = sense.english_definitions.join(', ');
        return `${index + 1}. (${pos}) ${definitions}`;
    }).join('\n');

    return `Reading: ${readings}\n\nDefinitions:\n${sensesInfo}`;
}

function showDefinition(surface,reading,baseForm,pos){
    fetch(`/jisho_proxy?keyword=${encodeURIComponent(surface)}`)
    .then(response => response.json())
    .then(data=>{
        console.log("Data received from backend:", data);
        
        const definitionsDiv = document.getElementById('wordDefinitions')
        const definitionElement = document.createElement('p')

        let englishDefinitions = 'No definition found';

        if (data.data && data.data.length > 0) {
            const jishoData = data.data[0];

            if (jishoData.senses && jishoData.senses.length > 0) {
                englishDefinitions = jishoData.senses
                    .map(sense => sense.english_definitions.join(', '))
                    .join('; ');
            }
        } else {
            console.log("No data returned from Jisho API");
        }

        console.log("English definitions:", englishDefinitions);

        definitionElement.innerHTML = `
                <strong>${surface}</strong><br>
                Reading: ${reading}<br>
                Base form: ${baseForm}<br>
                Part of speech: ${pos}<br>
                Definition: ${englishDefinitions}
            `;
        definitionsDiv.appendChild(definitionElement);
    })
    .catch(error => console.error('Error:', error));
}
export {showDefinition};