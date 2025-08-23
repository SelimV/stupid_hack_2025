import { Splitter } from './image_utils.js';
import { captchasData } from "./captchas_data.js"

// DEBUG: attach Splitter to the global window object for testing
window.Splitter = Splitter;

document.addEventListener('DOMContentLoaded', async function () {

    var state = 0
    var state_selection = []

    function reset_selection() {
        const data = captchasData[state]
        state_selection = Array(data.rows).fill().map(() => Array(data.cols).fill(0))
    }

    async function load_captcha() {
        const captchaContainer = document.getElementById('captcha-container');

        //clear previous
        while (captchaContainer.firstChild) {
            captchaContainer.removeChild(captchaContainer.lastChild)
        }

        const data = captchasData[state]

        document.getElementById("captcha-prompt-verb").innerText = data.prompt1
        document.getElementById("captcha-prompt").innerText = data.prompt2
        document.getElementById("attribution-image").innerText = data.attribution

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

                            // Toggle
                            state_selection[piece.row][piece.col] ^= true

                            img.classList.toggle('selected');
                        });
                    }
                    captchaContainer.appendChild(rowDiv);
                }
            });
    }

    document.getElementById("button-log-selection").addEventListener("click", (e) => {
        var selection_string = "["
        for (const row of state_selection) {
            selection_string += "[" + String(row) + "],"
        }

        console.log(selection_string + "]")
    })

    document.getElementById("button-submit").addEventListener("click", (e) => {
        const data = captchasData[state]
        document.getElementById("message-intermission").innerText = data.message_intermission_correct
        document.getElementById("captcha-view").setAttribute("hidden", true)
        document.getElementById("intermission-view").removeAttribute("hidden")
    })

    document.getElementById("button-retry").addEventListener("click", (e) => {
        reset_selection()
        document.getElementById("captcha-view").removeAttribute("hidden")
        document.getElementById("intermission-view").setAttribute("hidden", true)
    })

    document.getElementById("button-next").addEventListener("click", async (e) => {
        state = state + 1
        if (state < captchasData.length) {
            document.getElementById("captcha-view").removeAttribute("hidden")
            document.getElementById("intermission-view").setAttribute("hidden", true)
            reset_selection()
            await load_captcha()
        }
        else {
            document.getElementById("intermission-view").setAttribute("hidden", true)
            document.getElementById("reward-view").removeAttribute("hidden")
        }
    })

    reset_selection()
    await load_captcha()

});