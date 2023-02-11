import GameLogic from ".";
import Circle from "./Circle";
import Enemy from "./Enemy";
import Player from "./Player";
import ProjectileImpact from "./ProjectileImpact";
import { Vector2 } from "./types";

export default class Projectile extends Circle {
    gameLogic: GameLogic;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    center: Vector2;
    angle: number;
    orbitOrbitRadius: number;
    player: Player;
    constructor(gameLogic: GameLogic, x: number, y: number) {
        super(x, y, 10, "white", 1, gameLogic.ctx);
        this.gameLogic = gameLogic;
        this.canvas = gameLogic.canvas;
        this.ctx = gameLogic.ctx;
        this.center = gameLogic.center
        this.angle = Math.atan2(this.y, this.x);
        this.player = gameLogic.player!;


        this.orbitOrbitRadius = 0;
    }

    detectCollision() {

    }

    update() {
        if (!GameLogic.isGameOver) {
            // Check for collison with enemies
            GameLogic.enemies.forEach(enemy => {
                const isCollide = Circle.detectCollision(this, enemy);

                if (isCollide) {
                    enemy.targetRadius = Math.max(5, enemy.targetRadius - 10);
                    const projecttileIndex = this.player.projectiles.indexOf(this);
                    this.player.projectiles.splice(projecttileIndex, 1);
                    const impactCoords = {
                        x: (enemy.x + enemy.targetRadius) > this.x ? this.x : (enemy.x + enemy.targetRadius),
                        y: (enemy.y + enemy.targetRadius) > this.y ? this.y : (enemy.y + enemy.targetRadius)
                    };

                    for (let i = 0; i < 10; i++) {
                        const angle = (i / 10) * (Math.PI * 2);
                        ProjectileImpact.particles.push(new ProjectileImpact(this.gameLogic, angle, enemy.color, impactCoords))

                    }
                }
            })

            // Check if projectile has move out of canvas and remove it
            if (this.orbitOrbitRadius > Math.max(this.center.x + GameLogic.spawnOffset, this.center.y + GameLogic.spawnOffset)) {
                const projecttileIndex = this.player.projectiles.indexOf(this);
                this.player.projectiles.splice(projecttileIndex, 1);
            }

            this.orbitOrbitRadius = this.orbitOrbitRadius + 6;
        }

        // Update projectile values
        this.x = Math.cos(this.angle) * this.orbitOrbitRadius + this.center.x;
        this.y = Math.sin(this.angle) * this.orbitOrbitRadius + this.center.y;
        this.draw()
    }

    dispose() {

    }
}