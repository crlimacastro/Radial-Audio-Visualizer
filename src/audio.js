// Audio Context to interface with the API
let audioCtx;

// Source of the sounds
let audioElement;

// Nodes
let sourceNode;
let highShelfBiquadFilter;
let lowShelfBiquadFilter;
let distortionFilter
let analyserNode;
let gainNode;

const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

// Array of 8-bit integers (0-255) to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

const setupWebaudio = (filePath, audioSource = undefined) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    if (audioSource == undefined)
        audioElement = new Audio();
    else
        audioElement = audioSource;

    loadSoundFile(filePath);

    // Create nodes
    sourceNode = audioCtx.createMediaElementSource(audioElement);
    highShelfBiquadFilter = audioCtx.createBiquadFilter();
    highShelfBiquadFilter.type = "highshelf";
    lowShelfBiquadFilter = audioCtx.createBiquadFilter();
    lowShelfBiquadFilter.type = "lowshelf";
    distortionFilter = audioCtx.createWaveShaper();
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = DEFAULTS.numSamples; // fft stands for Fast Fourier Transform
    gainNode = audioCtx.createGain(); // volume node
    gainNode.gain.value = DEFAULTS.gain;

    // Connect nodes
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

const loadSoundFile = (filePath) => {
    audioElement.src = filePath;
}

const playCurrentSound = () => {
    audioElement.play();
}

const pauseCurrentSound = () => {
    audioElement.pause();
}

const setVolume = (value) => {
    value = Number(value); // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}

export {
    audioCtx,
    audioData,
    setupWebaudio,
    loadSoundFile,
    playCurrentSound,
    pauseCurrentSound,
    setVolume,
    analyserNode
};