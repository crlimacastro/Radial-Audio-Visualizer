const Convert = {
    // Converts radians to degrees
    radToDeg(radians) {
        return radians * 180 / Math.PI;
    },
    // Converts degrees to radians
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    },
    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    rgbToHex(r, g, b) {
        let componentToHex = (c) => {
            let hex = c.toString(16);
            return hex.length = 1 ? "0" + hex : hex;
        }

        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    },
    hexToRgb(hex, alpha = 1) {
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    hexToRgbObj(hex, alpha = 1) {
        return {
            r: parseInt(hex.substring(1, 3), 16),
            g: parseInt(hex.substring(3, 5), 16),
            b: parseInt(hex.substring(5, 7), 16),
            a: alpha
        };
    }

}

// Function for remapping a value from one range of numbers to another
const mapRange = (value, min1, max1, min2, max2) => {
    return min2 + (max2 - min2) * (value - min1) / (max1 - min1);
}

// Linear interpolation
const lerp = (a, b, t) => {
    return a * (1 - t) + b * t;
}

const average = (...items) => {
    let sum = 0;
    for (const item of items)
        sum += item;
    return sum / items.length;
}

// Gets back a copy of the array with all the numbers
// averaged out and closer together by a scalar amount
const getAveragedOutSet = (scalar, set) => {
    let averagedSet = [...set];
    const a = average(...set);
    for (let i = 0; i < set.length; i++)
        averagedSet[i] = a + scalar * (set[i] - a);

    return averagedSet;
}

// Returns the net change from one index to the other
const getDelta = (set, startIndex, endIndex) => {
    return set[endIndex] - set[startIndex];
}

export {
    Convert,
    mapRange,
    lerp,
    average,
    getAveragedOutSet,
    getDelta
}