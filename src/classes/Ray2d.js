const Ray2d = class {
    constructor(pos, dir) {
        this.pos = new Vector2d(pos.x, pos.y);
        this.dir = new Vector2d(dir.x, dir.y);
    }
    draw(ctx, color = "red", strokeWidth = 1) {
        this.dir.drawAt(ctx, this.pos.x, this.pos.y, color, strokeWidth);
    }
}

export default Ray2d;