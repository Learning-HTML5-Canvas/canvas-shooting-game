import { Vector2 } from "./types";
import { getDistance } from "./utils/mathCal";

export default class Circle {
    x: number;
    y: number;
    radius: number;
    color: string;
    alpha: number;
    ctx: CanvasRenderingContext2D;
    constructor(x: number, y: number, radius: number, color: string, alpha: number, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.ctx = ctx;
        this.alpha = alpha;
    }

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore()
    }

    static detectCollision(circle1: Circle, circle2: Circle) {
        const distance = getDistance(circle1.x, circle1.y, circle2.x, circle2.y);

        if (distance < circle1.radius + circle2.radius) return true;

        return false;
    }
}