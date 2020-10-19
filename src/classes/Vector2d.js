const Vector2d = class {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    static getMagnitude(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    normalize() {
        const magnitude = this.magnitude();
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }
    static getNormalized(v) {
        const magnitude = Vector2d.getMagnitude(v);
        return new Vector2d(v.x / magnitude, v.y / magnitude);
    }
    scale(scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
    }
    static getScaled(v, scalar) {
        return new Vector2d(v.x * scalar, v.y * scalar);
    }
    setMagnitude(magnitude) {
        this.normalize();
        this.scale(magnitude);
    }
    static getSetMagnitude(v, magnitude) {
        const normalized = Vector2d.getNormalized(v);
        const scaled = Vector2d.getScaled(normalized, magnitude);
        return new Vector2d(scaled.x, scaled.y);
    }
    rotate(angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const rotX = this.x * cos - this.y * sin;
        const rotY = this.x * sin + this.y * cos;
        this.x = rotX;
        this.y = rotY;
    }
    static getRotated(v, angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return new Vector2d(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
    }
    static getPerpendicular(v, counterClockwise = true) {
        if (counterClockwise)
            return new Vector2d(-v.y, v.x);
        else
            return new Vector2d(v.y, -v.x);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static wedge(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    }
    static areParallel(v1, v2) {
        return Vector2d.getMagnitude(v1) == 0 || Vector2d.getMagnitude(v2) == 0 ? false : Vector2d.wedge(v1, v2) == 0;
    }
    static component(v1, v2) {
        return Vector2d.dot(v1, v2) / Vector2d.getMagnitude(v2);
    }
    project(v) {
        const component = Vector2d.component(this, v);
        const normalized = Vector2d.getNormalized(v);
        this.x = normalized.x * component;
        this.y = normalized.y * component;
    }
    static getProjected(v1, v2) {
        const component = Vector2d.component(v1, v2);
        const normalized = Vector2d.getNormalized(v2);
        return new Vector2d(normalized.x * component, normalized.y * component);
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    static add(v1, v2) {
        return new Vector2d(v1.x + v2.x, v1.y + v2.y);
    }
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    static subtract(v1, v2) {
        return new Vector2d(v1.x - v2.x, v1.y - v2.y);
    }
    static getMidpoint(v1, v2) {
        return Vector2d.getScaled(Vector2d.add(v1, v2), .5);
    }
    static angleBetween(v1, v2) {
        return Math.acos(Vector2d.dot(v1, v2) / (Vector2d.getMagnitude(v1) * Vector2d.getMagnitude(v2)));
    }
    static getRandomUnit() {
        return new Vector2d(Math.random(), Math.random()).normalize();
    }
    drawAt(ctx, x = 0, y = 0, color = "red", strokeWidth = 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.x, y - this.y);
        ctx.closePath();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
    }
}

export default Vector2d;