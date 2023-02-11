import GameLogic from ".";
import Circle from "./Circle";
import { Vector2 } from "./types";
import { randomInitFromRange } from "./utils/mathCal";

export default class ProjectileImpact extends Circle {
    static particles: ProjectileImpact[];
    angle: number;
    orbitRadius: number;
    velocity: number;
    impactCoords: Vector2;
    constructor(gameLogic: GameLogic, angle: number, color: string, impactCoords: Vector2) {
        super(0, 0, 2, color, 1, gameLogic.ctx)
        this.angle = angle;
        this.impactCoords = impactCoords
        this.x = Math.cos(angle) + impactCoords.x;
        this.y = Math.cos(angle) + impactCoords.y;
        this.orbitRadius = 0;
        this.velocity = randomInitFromRange(1, 2);
    }

    update() {
        this.alpha = Math.max(0, this.alpha - 0.01)
        this.orbitRadius += this.velocity;
        this.x = Math.cos(this.angle) * this.orbitRadius + this.impactCoords.x
        this.y = Math.sin(this.angle) * this.orbitRadius + this.impactCoords.y

        this.draw();
    }
}