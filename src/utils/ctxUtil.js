const clear = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

const fillBackground = (ctx, color) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    ctx.restore();
}

const fadeTo = (ctx, r, g, b, fadeFactor = 1) => {
    let imgData = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    fadeFactor = Math.floor(fadeFactor);
    for (let i = 0; i < imgData.data.length; i += 4) {
        let oldR = imgData.data[i];
        let oldG = imgData.data[i + 1];
        let oldB = imgData.data[i + 2];
        if (oldR > r) {
            while (oldR - fadeFactor < r)
                fadeFactor--;
            oldR -= fadeFactor;
        } else if (oldR < r) {
            while (oldR + fadeFactor > r)
                fadeFactor++;
            oldR += fadeFactor;
        }
        imgData.data[i] = oldR;

        if (oldG > g) {
            while (oldG - fadeFactor < g)
                fadeFactor--;
            oldG -= fadeFactor;
        } else if (oldG < g) {
            while (oldG + fadeFactor > g)
                fadeFactor--;
            oldG += fadeFactor;
        }
        imgData.data[i + 1] = oldG;

        if (oldB > b) {
            while (oldB - fadeFactor < b)
                fadeFactor--;
            oldB -= fadeFactor;
        } else if (oldB < b) {
            while (oldB + fadeFactor > b)
                fadeFactor--;
            oldB += fadeFactor;
        }
        imgData.data[i + 2] = b;
    }
    ctx.putImageData(imgData, 0, 0);
}

const rotateAbout = (ctx, x, y, angle) => {
    ctx.translate(x, y);
    ctx.rotate(-angle);
    ctx.translate(-x, -y);
}

const scaleAbout = (ctx, x, y, scaleX, scaleY) => {
    ctx.translate(x, y);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-x, -y);
}

const fillRectangle = (ctx, x, y, w, h, color = "black", angle = 0) => {
    ctx.save();
    rotateAbout(ctx, (x + w * .5), (y + h * .5), angle);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

const strokeRectangle = (ctx, x, y, w, h, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    ctx.save();
    rotateAbout(ctx, (x + w * .5), (y + h * .5), angle);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const fillCircle = (ctx, x, y, r, color = "black") => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

const strokeCircle = (ctx, x, y, r, color = "black", strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    ctx.save()
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const fillTriangle = (ctx, x, y, b, h, color = "black", angle = 0) => {
    ctx.save();
    rotateAbout(ctx, (x + b * .5), (y + h * .5), angle);
    ctx.beginPath();
    ctx.moveTo(x - b * .5, y + h * .5);
    ctx.lineTo(x, y - h * .5);
    ctx.lineTo(x + b * .5, y + h * .5);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

const strokeTriangle = (ctx, x, y, b, h, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    ctx.save();
    rotateAbout(ctx, (x + b * .5), (y + h * .5), angle);
    ctx.beginPath();
    ctx.moveTo(x - b * .5, y + h * .5);
    ctx.lineTo(x, y - h * .5);
    ctx.lineTo(x + b * .5, y + h * .5);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const fillRightTriangle = (ctx, x, y, b, h, color = "black", angle = 0) => {
    ctx.save();
    rotateAbout(ctx, x, y, angle);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + b, y + h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

const strokeRightTriangle = (ctx, x, y, b, h, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    ctx.save();
    rotateAbout(ctx, x, y, angle);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + b, y + h);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const fillArc = (ctx, x, y, r, startTheta, endTheta, invert = false, color = "black", angle = 0) => {
    ctx.save();
    rotateAbout(ctx, x, y, angle);
    ctx.beginPath();
    if (endTheta > startTheta)
        ctx.arc(x, y, r, startTheta, -endTheta, !invert);
    else
        ctx.arc(x, y, r, startTheta, -endTheta, invert);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

const strokeArc = (ctx, x, y, r, startTheta, endTheta, invert = false, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    ctx.save();
    rotateAbout(ctx, x, y, angle);
    ctx.beginPath();
    if (endTheta > startTheta)
        ctx.arc(x, y, r, startTheta, -endTheta, !invert);
    else
        ctx.arc(x, y, r, startTheta, -endTheta, invert);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const fillPie = (ctx, x, y, r, startTheta, endTheta, invert = false, color = "black", angle = 0) => {
    ctx.save();
    rotateAbout(ctx, x, y, angle);
    ctx.beginPath();
    if (endTheta > startTheta)
        ctx.arc(x, y, r, startTheta, -endTheta, !invert);
    else
        ctx.arc(x, y, r, startTheta, -endTheta, invert);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

const strokePie = (ctx, x, y, r, startTheta, endTheta, invert = false, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    ctx.save();
    rotateAbout(ctx, x, y, angle);
    ctx.beginPath();
    if (endTheta > startTheta)
        ctx.arc(x, y, r, startTheta, -endTheta, !invert);
    else
        ctx.arc(x, y, r, startTheta, -endTheta, invert);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const fillRing = (ctx, x, y, r1, r2, color = "black") => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r1, 0, Math.PI * 2);
    ctx.arc(x, y, r2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

const strokeRing = (ctx, x, y, r1, r2, color = "black", strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    ctx.save()
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r1, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

const fillPolygon = (ctx, points, color = "black", angle = 0) => {
    if (points.length < 3) throw TypeError("'points' array does not contain at least 3 points");

    ctx.save();
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    for (let i = 0; i < points.length; i++) {
        if (points[i].x < minX)
            minX = points[i].x;
        else if (points[i].x > maxX)
            maxX = points[i].x;

        if (points[i].y < minY)
            minY = points[i].y;
        else if (points[i].y > maxY)
            maxY = points[i].y;
    }
    const w = maxX - minX;
    let h = maxY - minY;
    rotateAbout(ctx, minX + w * .5, minY + h * .5, angle);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++)
        ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

const strokePolygon = (ctx, points, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    if (points.length < 3) throw TypeError("'points' array does not contain at least 3 points");

    ctx.save();
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    for (let i = 0; i < points.length; i++) {
        if (points[i].x < minX)
            minX = points[i].x;
        else if (points[i].x > maxX)
            maxX = points[i].x;

        if (points[i].y < minY)
            minY = points[i].y;
        else if (points[i].y > maxY)
            maxY = points[i].y;
    }
    const w = maxX - minX;
    let h = maxY - minY;

    rotateAbout(ctx, minX + w * .5, minY + h * .5, angle);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++)
        ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const strokeLine = (ctx, x1, y1, x2, y2, color = "black", strokeWidth = 1, lineDash = []) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const strokeLines = (ctx, points, color = "black", strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    if (points.length < 2) throw TypeError("'points' array does not contain at least 2 points");

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++)
        ctx.lineTo(points[i].x, points[i].y);
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const strokeSin = (ctx, x, y, amplitude, periodLength, endTheta, color = "black", strokeWidth = 1, lineDash = [], lineJoin = "miter") => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let theta = Math.PI / 2, i = 0; theta < endTheta; theta += Math.PI, i++) {
        // X coord in the current period
        let iX = x + i * (periodLength / 2);
        // Y coord of sin theta in the current period 
        let iY = amplitude * Math.sin(theta);
        ctx.quadraticCurveTo(iX + (periodLength / 4), y - iY,
            iX + (periodLength / 2), y);
    }
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(lineDash);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
    ctx.save();
    const lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops)
        lg.addColorStop(stop.percent, stop.color);
    return lg;
};

const fillLinearGradient = (ctx, gradient, x, y, width, height, angle = 0) => {
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
}

const getRadialGradient = (ctx, x1, y1, r1, x2, y2, r2, colorStops) => {
    const rg = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
    for (let stop of colorStops)
        rg.addColorStop(stop.percent, stop.color);
    return rg;
}

const fillRadialGradient = (ctx, gradient, x, y, r) => {
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, r, r);
    ctx.restore();
}

const strokeQuadraticCurve = (ctx, x1, y1, cpx, cpy, x2, y2, color = "black", strokeWidth = 1) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpx, cpy, x2, y2);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

const strokeBezierCurve = (ctx, x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, color = "black", strokeWidth = 1) => {
    ctx.save();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

export {
    clear,
    fillBackground,
    fadeTo,
    rotateAbout,
    scaleAbout,
    fillRectangle,
    strokeRectangle,
    fillCircle,
    strokeCircle,
    fillTriangle,
    strokeTriangle,
    fillRightTriangle,
    strokeRightTriangle,
    fillArc,
    strokeArc,
    fillPie,
    strokePie,
    fillRing,
    strokeRing,
    fillPolygon,
    strokePolygon,
    strokeLine,
    strokeLines,
    strokeSin,
    getLinearGradient,
    fillLinearGradient,
    getRadialGradient,
    fillRadialGradient,
    strokeQuadraticCurve,
    strokeBezierCurve
}