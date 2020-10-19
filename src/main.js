import * as utils from './utils/utils.js';
import * as audio from './audio.js';
import * as audioVisualizer from './visualizer.js';

const drawParams = {
    showNoise: false,
    showInvert: false,
    showEmboss: false
};


const DEFAULT = Object.freeze({
    sound: "media/New Adventure Theme.mp3"
});

function init() {
    let audioElement = document.querySelector("audio");
    let canvasElement = document.querySelector("canvas");

    audio.setupWebaudio(DEFAULT.sound, audioElement);
    setupUI(canvasElement);
    audioVisualizer.setupCanvas(canvasElement, audio.analyserNode, audio.audioData);

    loop();
}

function setupUI(canvasElement) {
    // Fullscreen button
    const fsButton = document.querySelector("#fsButton");
    fsButton.onclick = e => {
        utils.goFullscreen(canvasElement);
    };

    const trackSelect = document.querySelector("#trackSelect");
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
    };

    // DrawParams checkboxes
    let noiseCB = document.querySelector("#noiseCB");
    noiseCB.checked = drawParams.showNoise;
    noiseCB.onchange = e => { drawParams.showNoise = e.target.checked };
    let invertCB = document.querySelector("#invertCB");
    invertCB.checked = drawParams.showInvert;
    invertCB.onchange = e => { drawParams.showInvert = e.target.checked };
    let embossCB = document.querySelector("#embossCB");
    embossCB.checked = drawParams.showEmboss;
    embossCB.onchange = e => { drawParams.showEmboss = e.target.checked };
}

function loop() {
    requestAnimationFrame(loop);

    audioVisualizer.draw(drawParams);
}


export { init };