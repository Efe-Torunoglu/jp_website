import { analyzeText } from './analyzeText.js';
import { showDefinition as importedShowDefinition } from './showDefinition.js';

window.showDefinition = importedShowDefinition;

document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const analyzeButton = document.getElementById('analyzeButton');
    const parsedWordsElement = document.getElementById('parsedWords');
    const translationElement = document.getElementById('translation');
    const explanationElement = document.getElementById('explanation');

    analyzeButton.addEventListener('click', () => {
        analyzeText(inputText.value, parsedWordsElement, translationElement, explanationElement);
    });
});