import { Splitter } from './image_utils.js';
import { captchasData } from "./captchas_data.js"

// DEBUG: attach Splitter to the global window object for testing
window.Splitter = Splitter;

document.addEventListener('DOMContentLoaded', async function () {

    var state = 0
    async function load_captcha() {
        const captchaContainer = document.getElementById('captcha-container');

        //clear previous
        while (captchaContainer.firstChild) {
            captchaContainer.removeChild(captchaContainer.lastChild)
        }

        const data = captchasData[state]

        await Splitter.splitImage(data.imagePath, data.rows, data.cols)
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

                        img.addEventListener('click', (e) => {
                            // TODO: Handle piece click
                            // For now, just log the piece's position
                            console.log(`Clicked on piece at row ${piece.row}, col ${piece.col}`);

                            img.classList.toggle('selected');
                        });
                    }
                    captchaContainer.appendChild(rowDiv);
                }
            });
    }



    document.getElementById("button-submit").addEventListener("click", (e) => {
        document.getElementById("captcha-view").setAttribute("hidden", true)
        document.getElementById("intermission-view").removeAttribute("hidden")
    })

    document.getElementById("button-retry").addEventListener("click", (e) => {
        document.getElementById("captcha-view").removeAttribute("hidden")
        document.getElementById("intermission-view").setAttribute("hidden", true)
    })

    document.getElementById("button-next").addEventListener("click", async (e) => {
        state = state + 1
        if (state < captchasData.length) {
            document.getElementById("captcha-view").removeAttribute("hidden")
            document.getElementById("intermission-view").setAttribute("hidden", true)
            await load_captcha()
        }
        else {
            document.getElementById("intermission-view").setAttribute("hidden", true)
            document.getElementById("reward-view").removeAttribute("hidden")
        }
    })

    await load_captcha()

});