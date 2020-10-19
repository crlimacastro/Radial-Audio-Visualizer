const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
}

const getRandomInt = (min, max) => {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomUnsignedByte = () => {
    return this.getRandomInt(0, 255);
}

const getRandomColor = (alpha = undefined) => {
    if (alpha)
        return `rgba(${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()}, ${alpha})`;
    else
        return `rgba(${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()}, 1)`;
}

export {
    getRandom,
    getRandomInt,
    getRandomUnsignedByte,
    getRandomColor
}