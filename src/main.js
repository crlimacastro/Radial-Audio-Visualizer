/*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './visualizer.js';

const drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showNoise: false,
    showInvert: false,
    showEmboss: false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3"
});

function init() {
    audio.setupWebaudio(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");

    // add .onclick event to button
    fsButton.onclick = e => {
        utils.goFullscreen(canvasElement);
    };

    // B - hookup play button
    const playButton = document.querySelector("#playButton");

    // add .onclick event to button
    playButton.onclick = e => {

        // check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        if (e.target.dataset.playing == "no") {
            // if track is currently paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
            // if track IS playing, pause it
        } else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
        }
    };

    // C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    // add .oninput event to slider
    volumeSlider.oninput = e => {
        // set the gain
        audio.setVolume(e.target.value);
        // update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    };

    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    // D - hookup track <select>
    let trackSelect = document.querySelector("#trackSelect");

    // add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playing = "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };

    // E - hookup drawParams checkboxes
    let gradientCB = document.querySelector("#gradientCB");
    let barsCB = document.querySelector("#barsCB");
    let circlesCB = document.querySelector("#circlesCB");
    let noiseCB = document.querySelector("#noiseCB");
    let invertCB = document.querySelector("#invertCB");
    let embossCB = document.querySelector("#embossCB");

    // add .onchange event to checkboxes
    gradientCB.onchange = e => { drawParams.showGradient = e.target.checked };
    barsCB.onchange = e => { drawParams.showBars = e.target.checked };
    circlesCB.onchange = e => { drawParams.showCircles = e.target.checked }
    noiseCB.onchange = e => { drawParams.showNoise = e.target.checked };;
    invertCB.onchange = e => { drawParams.showInvert = e.target.checked };
    embossCB.onchange = e => { drawParams.showEmboss = e.target.checked };

} // end setupUI

function loop() {
    requestAnimationFrame(loop);

    canvas.draw(drawParams);
}


export { init };