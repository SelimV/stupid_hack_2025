import { Splitter } from './image_utils.js';

// DEBUG: attach Splitter to the global window object for testing
window.Splitter = Splitter;  

document.addEventListener('DOMContentLoaded', async function() {
    const captchaContainer = document.getElementById('captcha-container');

    await Splitter.splitImage('assets/scandalous.jpg', 3, 3)
        .then(pieces => {
            for (const pieceRow of pieces) {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'captcha-row';
                for (const piece of pieceRow) {
                    // Create an image element for each piece
                    const img = document.createElement('img');
                    img.src = piece.dataURL;
                    img.alt = `Piece at row ${piece.row}, col ${piece.col}`;
                    rowDiv.appendChild(img);

                    img.addEventListener('click', () => {
                        // TODO: Handle piece click
                        // For now, just log the piece's position
                        console.log(`Clicked on piece at row ${piece.row}, col ${piece.col}`);
                    });
                }
                captchaContainer.appendChild(rowDiv);
            }
        });
});