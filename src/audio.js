// Audio Context to interface with the API
let audioCtx;

// Source of the sounds
let audioElement;

// Nodes
let sourceNode;
let highShelfBiquadFilter;
let lowShelfBiquadFilter;
let gainNode;
let distortionFilter;
let reverbNode;
let analyserNode;


const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

const DISTORTION_TYPE = Object.freeze({
    NONE: 0,
    BREAK: 1,
    RETRO: 2
});

// Array of 8-bit integers (0-255) to hold the audio frequency data
let byteFrequencyData = new Uint8Array(DEFAULTS.numSamples / 2);
let floatFrequencyData = new Float32Array(DEFAULTS.numSamples / 2);
let byteWaveformData = new Uint8Array(DEFAULTS.numSamples / 2);
let floatWaveformData = new Float32Array(DEFAULTS.numSamples / 2);

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
    gainNode = audioCtx.createGain(); // volume node
    gainNode.gain.value = DEFAULTS.gain;
    distortionFilter = audioCtx.createWaveShaper();
    reverbNode = audioCtx.createConvolver();
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = DEFAULTS.numSamples; // fft stands for Fast Fourier Transform

    // Connect nodes
    sourceNode.connect(highShelfBiquadFilter);
    highShelfBiquadFilter.connect(lowShelfBiquadFilter);
    lowShelfBiquadFilter.connect(gainNode);
    gainNode.connect(distortionFilter);
    distortionFilter.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
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

const getByteFrequencyData = () => {
    analyserNode.getByteFrequencyData(byteFrequencyData);
    return byteFrequencyData;
}

const getFloatFrequencyData = () => {
    analyserNode.getFloatFrequencyData(floatFrequencyData);
    return floatFrequencyData
}

const getByteWaveformData = () => {
    analyserNode.getByteTimeDomainData(byteWaveformData);
    return byteWaveformData;
}

const getFloatWaveformData = () => {
    analyserNode.getFloatTimeDomainData(floatWaveformData);
    return floatWaveformData;
}

const toggleHighshelf = (highshelf) => {
    if (highshelf) {
        highShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
        highShelfBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        highShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

const toggleLowshelf = (lowshelf) => {
    if (lowshelf) {
        lowShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        lowShelfBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        lowShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

const toggleReverb = (src) => {
    switch (src) {
        case "":
            distortionFilter.disconnect();
            reverbNode.disconnect();
            distortionFilter.connect(analyserNode);
            break;
        default:
            attachBuffer(reverbNode, src);
            distortionFilter.disconnect();
            reverbNode.disconnect();
            distortionFilter.connect(reverbNode);
            reverbNode.connect(analyserNode);
            break;
    }
}

const toggleDistortion = (distortionType, distortionAmount) => {
    if (distortionType === DISTORTION_TYPE.NONE)
        distortionFilter.curve = null;
    else {
        distortionFilter.curve = null;
        distortionFilter.curve = makeDistortionCurve(distortionType, distortionAmount);
    }
}

// from: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
function makeDistortionCurve(distortionType, amount = 20) {
    let n_samples = 256,
        curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        let x = i * 2 / n_samples - 1;
        switch (distortionType) {
            case DISTORTION_TYPE.BREAK:
                curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
                break;
            case DISTORTION_TYPE.RETRO:
                curve[i] = x * Math.sin(x) * amount / 5;
                break;
            default:
                return curve;
        }
    }
    return curve;
}

function attachBuffer(convolverNode, src) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open('GET', "../../" + src, true);
    ajaxRequest.responseType = 'arraybuffer';
    ajaxRequest.onload = function() {
        let audioData = ajaxRequest.response;
        audioCtx.decodeAudioData(audioData, buffer => {
            convolverNode.buffer = buffer;
        }, function(e) { "Error with decoding audio data" + e.err });
    }
    ajaxRequest.send();
}

export {
    audioCtx,
    setupWebaudio,
    loadSoundFile,
    playCurrentSound,
    pauseCurrentSound,
    setVolume,
    analyserNode,
    getByteFrequencyData,
    getFloatFrequencyData,
    getByteWaveformData,
    getFloatWaveformData,
    toggleHighshelf,
    toggleLowshelf,
    toggleReverb,
    toggleDistortion,
    DISTORTION_TYPE
};