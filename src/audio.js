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
    sourceNode.connect(highShelfBiquadFilter);
    highShelfBiquadFilter.connect(lowShelfBiquadFilter);
    lowShelfBiquadFilter.connect(distortionFilter);
    distortionFilter.connect(analyserNode);
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

function toggleHighshelf(highshelf) {
    if (highshelf) {
        highShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
        highShelfBiquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
    } else {
        highShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function toggleLowshelf(lowshelf) {
    if (lowshelf) {
        lowShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        lowShelfBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        lowShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function toggleDistortion(distortion, distortionAmount) {
    if (distortion) {
        distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
        distortionFilter.curve = makeDistortionCurve(distortionAmount);
    } else {
        distortionFilter.curve = null;
    }
}

// from: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
function makeDistortionCurve(amount = 20) {
    let n_samples = 256,
        curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
        // Other possible curves
        //curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
        //curve[i] =(Math.PI + 100 * x/2) / (Math.PI + 100 * Math.abs(x)); // nice distortion
        //curve[i] = -(Math.PI + 100 * x/2) / (Math.PI + 50 * Math.abs(x));
        //			
        //curve[i] = Math.random() * 2 - 1;	// static!	
        //curve[i] = x * 5 + Math.random() * 2 - 1; // adds a less intrusive static to the audio
        // curve[i] = x * Math.sin(x) * amount/5; // sounds like a cross between Donlad Duck and Cartman from South Park
        //curve[i] = x * x - Math.tan(x) - .5 * x * 2 * Math.cos(x * 5);

        //(3 + 20) * x * 57 * (Math.PI / 180) / (Math.PI + 20 * Math.abs(x)) // from the stack overflow post
    }
    return curve;
}

export {
    audioCtx,
    audioData,
    setupWebaudio,
    loadSoundFile,
    playCurrentSound,
    pauseCurrentSound,
    setVolume,
    analyserNode,
    toggleHighshelf,
    toggleLowshelf,
    toggleDistortion
};