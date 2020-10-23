import { fillRadialGradient } from './utils/ctxUtil.js';
import { ctxUtil, mathUtil } from './utils/utils.js';

const Circle = class {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    draw(ctx) {
        ctxUtil.strokeCircle(ctx, this.x, this.y, this.r, "white", 5);
    }

    update(updateFunction) {
        updateFunction(this);
    }
};

let ctx;
let canvasWidth;
let canvasHeight;
let canvasCenterX;
let canvasCenterY;

let backgroundColor;

let analyserNode;
let audioData;


// Polygon data
const points = [];
const frequencyScalar = 1.9;
let polygonGradient;

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

    polygonGradient = ctxUtil.getRadialGradient(ctx,
        canvasCenterX,
        canvasCenterY,
        0,
        canvasCenterX,
        canvasCenterY,
        canvasCenterX > canvasCenterY ? canvasCenterX : canvasCenterY, [
            { percent: 0, color: '#009ffd' },
            { percent: 1, color: '#2a2a72' }
        ]);

    averageCircleGradient = ctxUtil.getRadialGradient(ctx,
        canvasCenterX,
        canvasCenterY,
        0,
        canvasCenterX,
        canvasCenterY,
        canvasCenterX > canvasCenterY ? canvasCenterX : canvasCenterY, [
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
    // analyserNode.getByteTimeDomainData(audioData); // waveform data

    // Draw background
    ctxUtil.fillRectangle(ctx, 0, 0, canvasWidth, canvasHeight, backgroundColor);

    // Draw polygon
    const numPoints = audioData.length;

    let theta = 0;
    const dTheta = 2 * Math.PI / numPoints;

    // Clear points array
    points.length = 0;
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: canvasCenterX + frequencyScalar * audioData[i] * Math.cos(theta),
            y: canvasCenterY + frequencyScalar * audioData[i] * Math.sin(theta)
        });

        theta -= dTheta;
    }
    if (points.length > 3)
        ctxUtil.fillPolygon(ctx, points, polygonGradient);

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
    if (params.showNoise ||
        params.showTint ||
        params.showSepia ||
        params.showInvert ||
        params.showGrayscale) {
        let noiseColor;
        if (params.showNoise)
            noiseColor = mathUtil.Convert.hexToRgbObj(params.noiseColor);
        let tintColor;
        if (params.showTint)
            tintColor = mathUtil.Convert.hexToRgbObj(params.tintColor);

        for (let i = 0; i < length; i += 4) {
            // Noise
            if (params.showNoise && Math.random() < params.noisePercent) {
                data[i] = noiseColor.r;
                data[i + 1] = noiseColor.g;
                data[i + 2] = noiseColor.b;
            }
            // Tint
            if (params.showTint) {
                data[i] += tintColor.r;
                data[i + 1] += tintColor.g;
                data[i + 2] += tintColor.b;
            }
            // Sepia
            if (params.showSepia) {
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];
                data[i] = r * .393 + g * .769 + b * .189;
                data[i + 1] = r * .349 + g * .686 + b * .168;
                data[i + 2] = r * .272 + g * .534 + b * .131;
            }
            // Invert
            if (params.showInvert) {
                data[i] = 255 - data[i]; // set red value
                data[i + 1] = 255 - data[i + 1]; // set blue value
                data[i + 2] = 255 - data[i + 2]; // set green value
            }
            // Grayscale
            if (params.showGrayscale) {
                let average = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = average;
                data[i + 1] = average;
                data[i + 2] = average;
            }
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