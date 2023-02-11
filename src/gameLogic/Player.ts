import GameLogic from ".";
import Circle from "./Circle";
import Projectile from "./Projectile";
import ProjectileImpact from "./ProjectileImpact";
import { Vector2 } from "./types";

export default class Player extends Circle {
    gameLogic: GameLogic;
    canvas: HTMLCanvasElement;
    center: Vector2;
    projectiles!: Projectile[];
    clickHandler: any;
    constructor(gameLogic: GameLogic) {
        super(gameLogic.center.x, gameLogic.center.y, 30, "white", 1, gameLogic.ctx);
        this.gameLogic = gameLogic;
        this.canvas = gameLogic.canvas;
        this.center = gameLogic.center;
        this.projectiles = [];
        ProjectileImpact.particles = [];

        this.clickHandler = this.clickCallback.bind(this);
        window.addEventListener("click", this.clickHandler);
    }

    clickCallback(e: MouseEvent) {
        if (!GameLogic.isGameOver) {

            // Tranlate mouse coords to start from the center of the canvas
            let mouseX = e.clientX - this.gameLogic.center.x
            let mouseY = e.clientY - this.gameLogic.center.y

            this.projectiles.push(new Projectile(this.gameLogic, mouseX, mouseY));
        }
    }

    gameOver() {
        this.projectiles = [];
        setTimeout(() => {
            window.removeEventListener("click", this.clickHandler)
        }, 0)

    }

    gameRestart() {
        this.clickHandler = this.clickCallback.bind(this);
        this.projectiles = [];
        setTimeout(() => {
            window.addEventListener("click", this.clickHandler);
        }, 0)

    }

    resize() {
        this.x = this.center.x;
        this.y = this.center.y;
    }


    update() {

        if (!GameLogic.isGameOver) {
            this.projectiles.forEach(projectile => {
                projectile.update();
            })
            ProjectileImpact.particles.forEach((particle, index) => {
                particle.update();
                if (particle.alpha === 0) {
                    ProjectileImpact.particles.splice(index, 1);
                }
            })
        }

        this.draw();
    }

    dispose() {
        this.projectiles = [];
        window.removeEventListener("click", this.clickHandler)
    }
}