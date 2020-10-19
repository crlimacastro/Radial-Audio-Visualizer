import { ctxUtil, mathUtil } from './utils/utils.js';

let ctx;
let canvasWidth;
let canvasHeight;

let backgroundColor;

let analyserNode;
let audioData;

const setupCanvas = (canvasElement, analyserNodeRef, audioDataRef) => {
    // Create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;

    // Define the background color
    backgroundColor = "rba(0, 0, 0, .1)";

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
    ctxUtil.fillBackground(ctx, backgroundColor);

    // Draw polygon
    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;
    let baseR = 50;
    let frequencyScalar = 0.5;
    let rScalar = 0.75;

    let points = new Array();

    let minFreq = 20;
    let maxFreq = [...audioData].indexOf(0);
    let theta = 0;
    let numPoints = maxFreq - minFreq;
    const dTheta = 2 * Math.PI / numPoints;

    for (let i = minFreq; i < maxFreq; i++) {
        let thetaScalar;
        if (theta < -3 * Math.PI / 2)
            thetaScalar = (Math.abs(theta) ** 0.2);
        else
            thetaScalar = 1;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        points.push({
            x: centerX + rScalar * (baseR * cos + frequencyScalar * audioData[i] * cos) * thetaScalar,
            y: centerY + rScalar * (baseR * sin + frequencyScalar * audioData[i] * sin) * thetaScalar
        });

        theta -= dTheta;
    }
    if (points.length > 3)
        ctxUtil.fillPolygon(ctx, points, "blue");

    // Draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, .5)';
        // loop through the data and draw!
        for (let i = 0; i < audioData.length; i++) {
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
        }
        ctx.restore();
    }

    // 5 - draw circles
    if (params.showCircles) {
        let maxRadius = canvasHeight / 4;
        ctx.save();
        ctx.globalAlpha = .5;
        for (let i = 0; i < audioData.length; i++) {
            // red-ish circles
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 111, 111, ${.34 - percent / 3.0})`;
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            // blue-ish circles, bigger, more transparent
            ctx.beginPath();
            ctx.fillStyle = `rgba(0, 0, 255, ${.1 - percent / 10.0})`;
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            // yellow-ish circles, smaller
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = `rgba(200, 200, 0, ${.5 - percent / 5.0})`;
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * .5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }

    // Bitmap manipulation (only if an)
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    // data[i] is the red channel
    // data[i+1] is the green channel
    // data[i+2] is the blue channel
    // data[i+3] is the alpha channel
    for (let i = 0; i < length; i += 4) {
        // White Noise
        if (params.showNoise && Math.random() < .05) {
            // Make all channels 100%
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
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