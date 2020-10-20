import { ctxUtil, mathUtil } from './utils/utils.js';

let ctx;
let canvasWidth;
let canvasHeight;
let canvasCenterX;
let canvasCenterY;

let backgroundColor;

let analyserNode;
let audioData;

// Polygon data
const frequencyScalar = 1.9;

// Pulses data
const triggerThreashold = 40;

// Average Circle data
const averageRadiusScalar = 1.1;
let averageCircleGradient;

const setupCanvas = (canvasElement, analyserNodeRef, audioDataRef) => {
    // Create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    canvasCenterX = canvasWidth / 2;
    canvasCenterY = canvasHeight / 2;

    // Define the background color
    backgroundColor = "rba(0, 0, 0, .1)";

    averageCircleGradient = ctxUtil.getRadialGradient(ctx, canvasCenterX, 0, canvasCenterX, canvasHeight, -1, 1, [
        { percent: 0, color: '#ffdd00' },
        { percent: 1, color: '#cc6600' }
    ]);

    // Keep a reference to the analyser node
    analyserNode = analyserNodeRef
        // Array where the analyser data will be stored
    audioData = audioDataRef;
}

const draw = (params = {}) => {
    // Populate the audioData array with the frequency data from the analyserNode
    analyserNode.getByteFrequencyData(audioData);
    // OR
    //analyserNode.getByteTimeDomainData(audioData); // waveform data

    // Draw background
    ctxUtil.fillRectangle(ctx, 0, 0, canvasWidth, canvasHeight, backgroundColor);

    // Draw polygon
    const numPoints = audioData.length;

    let theta = 0;
    const dTheta = 2 * Math.PI / numPoints;

    let points = new Array();
    for (let i = 0; i < numPoints; i++) {
        points.push({

            x: canvasCenterX + frequencyScalar * audioData[i] * Math.cos(theta),
            y: canvasCenterY + frequencyScalar * audioData[i] * Math.sin(theta)
        });

        // Draw pulses
        let delta = mathUtil.getDelta(audioData, i, Math.min(i + 10, audioData.length));
        // delta frequency is big enough, trigger
        if (delta > triggerThreashold) {
            // TODO draw pulses
        }

        theta -= dTheta;
    }
    if (points.length > 3)
        ctxUtil.fillPolygon(ctx, points, "blue");

    // Draw average loudness circle
    let average = mathUtil.average(...audioData);
    ctxUtil.fillCircle(ctx, canvasCenterX, canvasCenterY, average * averageRadiusScalar, averageCircleGradient);

    // Bitmap manipulation
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    // data[i] is the red channel
    // data[i+1] is the green channel
    // data[i+2] is the blue channel
    // data[i+3] is the alpha channel
    for (let i = 0; i < length; i += 4) {
        // Noise
        if (params.showNoise && Math.random() < .05) {
            let color;

            if (params.noiseColor)
                color = mathUtil.Convert.hexToRgb(params.noiseColor);
            else
                color = { r: 255, g: 255, b: 255 };

            // Make all channels 100%
            data[i] = color.r;
            data[i + 1] = color.g;
            data[i + 2] = color.b;
        }
        // Invert
        if (params.showInvert) {
            data[i] = 255 - data[i]; // set red value
            data[i + 1] = 255 - data[i + 1]; // set blue value
            data[i + 2] = 255 - data[i + 2]; // set green value
        }
    }
    //Emboss
    if (params.showEmboss) {
        // Stepping through *each* sub-pixel
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue; // skip alpha channel
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }

    // C) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}

export { setupCanvas, draw };