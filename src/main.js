import * as utils from './utils/utils.js';
import * as audio from './audio.js';
import * as audioVisualizer from './visualizer.js';

const drawParams = {
    showFrequency: true,
    showWaveform: true,
    showAverage: true,
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
    distortionType: audio.DISTORTION_TYPE.NONE,
    distortionAmount: 20
};

const DEFAULT = Object.freeze({
    sound: "media/Dream Sweet in Sea Major.mp3"
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
    audioVisualizer.setupCanvas(canvasElement);

    loop();
}

function setupUI(canvasElement) {
    // Fullscreen button
    const fsButton = document.querySelector("#fsButton");
    fsButton.onclick = e => {
        utils.goFullscreen(canvasElement);
    };

    const trackSelect = document.querySelector("#trackSelect");
    // Set default sound
    for (let i = 0; i < trackSelect.options.length; i++) {
        if (trackSelect.options[i].value == DEFAULT.sound) {
            trackSelect.selectedIndex = i;
            break;
        }
    }
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
    };

    const trackFile = document.querySelector("#trackFile");
    trackFile.onchange = e => {
        if (e.target.files[0])
            audioElement.src = URL.createObjectURL(e.target.files[0]);
    };

    // Show checkboxes
    let showFrequencyCB = document.querySelector("#showFrequencyCB");
    showFrequencyCB.checked = drawParams.showFrequency;
    showFrequencyCB.onchange = e => { drawParams.showFrequency = e.target.checked };
    let showWaveformCB = document.querySelector("#showWaveformCB");
    showWaveformCB.checked = drawParams.showWaveform;
    showWaveformCB.onchange = e => { drawParams.showWaveform = e.target.checked };
    let showAverageCB = document.querySelector("#showAverageCB");
    showAverageCB.checked = drawParams.showAverage;
    showAverageCB.onchange = e => { drawParams.showAverage = e.target.checked };

    // Bitmap manipulation checkboxes
    // Noise
    let noiseCB = document.querySelector("#noiseCB");
    noiseCB.checked = drawParams.showNoise;
    noiseCB.onchange = e => { drawParams.showNoise = e.target.checked };
    let noiseColor = document.querySelector("#noiseColor");
    noiseColor.value = drawParams.noiseColor;
    noiseColor.oninput = e => { drawParams.noiseColor = e.target.value; };
    let noisePercent = document.querySelector('#noisePercent');
    noisePercent.value = drawParams.noisePercent;
    noisePercent.oninput = e => { drawParams.noisePercent = Number(e.target.value); };
    // Tint
    let tintCB = document.querySelector('#tintCB');
    tintCB.value = drawParams.showTint;
    tintCB.onchange = e => { drawParams.showTint = e.target.checked };
    let tintColor = document.querySelector("#tintColor");
    tintColor.value = drawParams.tintColor;
    tintColor.oninput = e => { drawParams.tintColor = e.target.value; };
    // Sepia
    let sepiaCB = document.querySelector('#sepiaCB');
    sepiaCB.checked = drawParams.showSepia;
    sepiaCB.onchange = e => { drawParams.showSepia = e.target.checked };
    // Invert
    let invertCB = document.querySelector("#invertCB");
    invertCB.checked = drawParams.showInvert;
    invertCB.onchange = e => { drawParams.showInvert = e.target.checked };
    // Emboss
    let embossCB = document.querySelector("#embossCB");
    embossCB.checked = drawParams.showEmboss;
    embossCB.onchange = e => { drawParams.showEmboss = e.target.checked };
    // Grayscale
    let grayscaleCB = document.querySelector("#grayscaleCB");
    grayscaleCB.checked = drawParams.showGrayscale;
    grayscaleCB.onchange = e => { drawParams.showGrayscale = e.target.checked };

    // Audio checkboxes
    // Highshelf Filter
    let highshelfCB = document.querySelector("#highshelfCB");
    highshelfCB.checked = audioParams.highshelf;
    highshelfCB.onchange = e => {
            audioParams.highshelf = e.target.checked;
            audio.toggleHighshelf(audioParams.highshelf);
        }
        // Lowshelf Filter
    let lowshelfCB = document.querySelector("#lowshelfCB");
    lowshelfCB.checked = audioParams.lowshelf;
    lowshelfCB.onchange = e => {
            audioParams.lowshelf = e.target.checked;
            audio.toggleLowshelf(audioParams.lowshelf);
        }
        // Reverb
    let reverbRadios = document.querySelectorAll('input[name="reverbRBs"]');
    for (const rb of reverbRadios) {
        rb.onclick = e => {
            audio.toggleReverb(e.target.value);
        };
    }
    // Distortion
    let distortionRadios = document.querySelectorAll('input[name="distortionRBs"]');
    let noDistortionRB = document.querySelector("#noDistortionRB");
    noDistortionRB.onclick = e => {
        audioParams.distortionType = audio.DISTORTION_TYPE.NONE;
        audio.toggleDistortion(audioParams.distortionType, audioParams.distortionAmount);
    };
    let breakageRB = document.querySelector("#breakageRB");
    breakageRB.onclick = e => {
        audioParams.distortionType = audio.DISTORTION_TYPE.BREAK;
        audio.toggleDistortion(audioParams.distortionType, audioParams.distortionAmount);
    };
    let retroRB = document.querySelector("#retroRB");
    retroRB.onclick = e => {
        audioParams.distortionType = audio.DISTORTION_TYPE.RETRO;
        audio.toggleDistortion(audioParams.distortionType, audioParams.distortionAmount);
    };
    // Uncheck all distortion radio buttons
    for (const rb of distortionRadios) {

        rb.checked = false;
    }
    // Check the one set in audioParams
    switch (audioParams.distortionType) {
        case audio.DISTORTION_TYPE.NONE:
            noDistortionRB.checked = true;
            break;
        case audio.DISTORTION_TYPE.BREAK:
            breakageRB.checked = true;
            break;
        case audio.DISTORTION_TYPE.RETRO:
            retroRB.checked = true;
            break;
        default:
            noDistortionRB.checked = true;
            break;
    }
    let distortionSlider = document.querySelector("#distortionSlider");
    distortionSlider.value = audioParams.distortionAmount;
    distortionSlider.oninput = e => {
        audioParams.distortionAmount = Number(e.target.value);
        audio.toggleDistortion(audioParams.distortionType, audioParams.distortionAmount);
    }
}

function loop() {
    requestAnimationFrame(loop);

    audioVisualizer.draw(drawParams);
}

export { init };