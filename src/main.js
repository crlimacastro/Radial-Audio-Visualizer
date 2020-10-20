import * as utils from './utils/utils.js';
import * as audio from './audio.js';
import * as audioVisualizer from './visualizer.js';

const drawParams = {
    showNoise: false,
    noiseColor: '#ffffff',
    showInvert: false,
    showEmboss: false
};

const audioParams = {
    highshelf: false,
    lowshelf: false,
    distortion: false,
    distortionAmount: 20
};

const DEFAULT = Object.freeze({
    sound: "media/New Adventure Theme.mp3"
});

function init() {
    let audioElement = document.querySelector("audio");
    let canvasElement = document.querySelector("canvas");
    canvasElement.width = 1980;
    canvasElement.height = 1080;

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
    let noiseColor = document.querySelector("#noiseColor");
    noiseColor.value = drawParams.noiseColor;
    noiseColor.oninput = e => { drawParams.noiseColor = e.target.value; };
    let invertCB = document.querySelector("#invertCB");
    invertCB.checked = drawParams.showInvert;
    invertCB.onchange = e => { drawParams.showInvert = e.target.checked };
    let embossCB = document.querySelector("#embossCB");
    embossCB.checked = drawParams.showEmboss;
    embossCB.onchange = e => { drawParams.showEmboss = e.target.checked };

    // Audio checkboxes
    let highshelfCB = document.querySelector("#highshelfCB");
    highshelfCB.checked = audioParams.highshelf;
    highshelfCB.onchange = e => {
        audioParams.highshelf = e.target.checked;
        audio.toggleHighshelf(audioParams.highshelf);
    }
    let lowshelfCB = document.querySelector("#lowshelfCB");
    lowshelfCB.checked = audioParams.lowshelf;
    lowshelfCB.onchange = e => {
        audioParams.lowshelf = e.target.checked;
        audio.toggleLowshelf(audioParams.lowshelf);
    }
    let distortionCB = document.querySelector("#distortionCB");
    distortionCB.checked = audioParams.distortion;
    distortionCB.onchange = e => {
        audioParams.distortion = e.target.checked;
        audio.toggleDistortion(audioParams.distortion, audioParams.distortionAmount);
    }
    let distortionSlider = document.querySelector("#distortionSlider");
    distortionSlider.value = audioParams.distortionAmount;
    distortionSlider.oninput = e => {
        audioParams.distortionAmount = Number(e.target.value);
        audio.toggleDistortion(audioParams.distortion, audioParams.distortionAmount);
    }
}

function loop() {
    requestAnimationFrame(loop);

    audioVisualizer.draw(drawParams);
}

export { init };