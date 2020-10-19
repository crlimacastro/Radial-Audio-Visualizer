const Convert = {
    // Converts radians to degrees
    radToDeg(radians) {
        return radians * 180 / Math.PI;
    },
    // Converts degrees to radians
    degToRad(degrees) {
        return degrees * Math.PI / 180;
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

export {
    Convert,
    mapRange,
    lerp,
    average,
    getAveragedOutSet
}