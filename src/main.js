import * as utils from './utils/utils.js';
import * as audio from './audio.js';
import * as audioVisualizer from './visualizer.js';

const drawParams = {
    showNoise: false,
    noiseColor: '#ffffff',
    noisePercent: .05,
    showTint: false,
    tintColor: '#ff3333',
    showSepia: false,
    showInvert: false,
    showEmboss: false,
    showGrayscale: false,
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

let audioElement;
let canvasElement;

function init() {
    audioElement = document.querySelector("audio");
    canvasElement = document.querySelector("canvas");
    canvasElement.width = 1920;
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

    const trackFile = document.querySelector("#trackFile");
    trackFile.onchange = e => {
        if (e.target.files[0])
            audioElement.src = URL.createObjectURL(e.target.files[0]);
    };

    // DrawParams checkboxes
    let noiseCB = document.querySelector("#noiseCB");
    noiseCB.checked = drawParams.showNoise;
    noiseCB.onchange = e => { drawParams.showNoise = e.target.checked };
    let noiseColor = document.querySelector("#noiseColor");
    noiseColor.value = drawParams.noiseColor;
    noiseColor.oninput = e => { drawParams.noiseColor = e.target.value; };
    let noisePercent = document.querySelector('#noisePercent');
    noisePercent.value = drawParams.noisePercent;
    noisePercent.oninput = e => { drawParams.noisePercent = Number(e.target.value); };
    let tintCB = document.querySelector('#tintCB');
    tintCB.value = drawParams.showTint;
    tintCB.onchange = e => { drawParams.showTint = e.target.checked };
    let tintColor = document.querySelector("#tintColor");
    tintColor.value = drawParams.tintColor;
    tintColor.oninput = e => { drawParams.tintColor = e.target.value; };
    let sepiaCB = document.querySelector('#sepiaCB');
    sepiaCB.checked = drawParams.showSepia;
    sepiaCB.onchange = e => { drawParams.showSepia = e.target.checked };
    let invertCB = document.querySelector("#invertCB");
    invertCB.checked = drawParams.showInvert;
    invertCB.onchange = e => { drawParams.showInvert = e.target.checked };
    let embossCB = document.querySelector("#embossCB");
    embossCB.checked = drawParams.showEmboss;
    embossCB.onchange = e => { drawParams.showEmboss = e.target.checked };
    let grayscaleCB = document.querySelector("#grayscaleCB");
    grayscaleCB.checked = drawParams.showGrayscale;
    grayscaleCB.onchange = e => { drawParams.showGrayscale = e.target.checked };

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