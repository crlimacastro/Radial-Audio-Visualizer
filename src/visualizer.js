import { ctxUtil, mathUtil } from './utils/utils.js';
import * as audio from './audio.js';

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


// Polygon data
const polygonPoints = [];
const frequencyScalar = 2.4;
let polygonGradient;

// Average Circle data
const averageScalar = 1.5;
let averageCircleGradient;

// Waveform data
const waveformPoints = [];
const waveformScalar = .008;
const waveformColor = "white";
const waveformWidth = 3;


const setupCanvas = (canvasElement) => {
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
}

const draw = (params = {}) => {
    // Draw background
    ctxUtil.fillRectangle(ctx, 0, 0, canvasWidth, canvasHeight, backgroundColor);


    if (params.showFrequency ||
        params.showAverage ||
        params.showWaveform ||
        params.showProgress) {
        // Only grab frequency data and average if needed for
        // any of the visualizer shapes
        let frequencyData = audio.getByteFrequencyData();
        let average = mathUtil.average(...frequencyData);

        if (params.showFrequency) {
            // Draw frequency polygon
            let theta = 0;
            let dTheta = 2 * Math.PI / frequencyData.length;
            // Clear polygon points array
            polygonPoints.length = 0;
            // Populate polygon points array
            for (let i = 0; i < frequencyData.length; i++) {
                let cos = Math.cos(theta);
                let sin = Math.sin(theta);

                let startX = averageScalar * average * cos;
                let startY = averageScalar * average * sin;

                polygonPoints.push({
                    x: canvasCenterX + startX + frequencyScalar * frequencyData[i] * Math.cos(theta),
                    y: canvasCenterY + startY + frequencyScalar * frequencyData[i] * Math.sin(theta)
                });

                theta -= dTheta;
            }
            // Draw polygon
            if (polygonPoints.length > 3)
                ctxUtil.fillPolygon(ctx, polygonPoints, polygonGradient);
        }

        if (params.showAverage) {
            // Draw average loudness circle
            ctxUtil.fillCircle(ctx, canvasCenterX, canvasCenterY, averageScalar * average, averageCircleGradient);
        }

        if (params.showProgress) {
            let duration = audio.audioElement.duration;
            let currentTime = audio.audioElement.currentTime;
            let percentDone = currentTime / duration;

            // Make sure a value was actually obtained
            if (percentDone) {
                // Draw an empty average circle that fills as the progress grows
                ctxUtil.fillPie(ctx, canvasCenterX, canvasCenterY, averageScalar * average + 1, 0, 2 * Math.PI * percentDone, false, backgroundColor);
            }

        }

        if (params.showWaveform) {
            // Only grab waveform data if necessary
            let waveformData = audio.getByteWaveformData();

            // Draw waveform
            let x = canvasCenterX - average * averageScalar;
            let dx = average * averageScalar * 2 / waveformData.length;
            // Clear waveform points array
            waveformPoints.length = 0;
            // Populate waveform points array
            waveformPoints.push({ x: canvasCenterX - average * averageScalar, y: canvasCenterY });
            for (let i = 0; i < waveformData.length - 1; i++) {
                x += dx;
                waveformPoints.push({
                    x: x,
                    y: canvasCenterY + (waveformData[i] - 128) * waveformScalar * average
                });
            }
            waveformPoints.push({ x: canvasCenterX + average * averageScalar, y: canvasCenterY });
            // Draw waveform
            ctxUtil.strokeLines(ctx, waveformPoints, waveformColor, waveformWidth);
        }
    }

    // Bitmap manipulation
    if (params.showNoise ||
        params.showTint ||
        params.showSepia ||
        params.showInvert ||
        params.showEmboss ||
        params.showGrayscale) {
        // Only grab data if any of the bitmap checkboxes are on
        let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;

        let noiseColor;
        if (params.showNoise)
            noiseColor = mathUtil.Convert.hexToRgbObj(params.noiseColor);
        let tintColor;
        if (params.showTint)
            tintColor = mathUtil.Convert.hexToRgbObj(params.tintColor);

        // data[i] is the red channel
        // data[i+1] is the green channel
        // data[i+2] is the blue channel
        // data[i+3] is the alpha channel
        for (let i = 0; i < length; i += 4) {
            // Emboss
            if (params.showEmboss) {
                data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
                data[i + 1] = 127 + 2 * data[i + 1] - data[i + 5] - data[i + 1 + width * 4];
                data[i + 2] = 127 + 2 * data[i + 2] - data[i + 6] - data[i + 2 + width * 4];
            }
            // Tint
            if (params.showTint) {
                data[i] += tintColor.r;
                data[i + 1] += tintColor.g;
                data[i + 2] += tintColor.b;
            }
            // Noise
            if (params.showNoise && Math.random() < params.noisePercent) {
                data[i] = noiseColor.r;
                data[i + 1] = noiseColor.g;
                data[i + 2] = noiseColor.b;
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

        // Copy image data back to canvas
        ctx.putImageData(imageData, 0, 0);
    }
}

export { setupCanvas, draw };