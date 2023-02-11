import GameLogic from ".";
import Circle from "./Circle";
import Player from "./Player";
import { Vector2 } from "./types";
import { randomColor, randomInitFromRange } from "./utils/mathCal";

export default class Enemy extends Circle {
    static colors: string[];
    static spawIntervalCount: number;
    static setIntervalId: number;
    static velocity: number;
    gameLogic: GameLogic;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    center: Vector2;
    angle: number;
    orbitOrbitRadius: number;
    player: Player;
    targetRadius: number;
    shrinkIntensity: number;
    constructor(gameLogic: GameLogic) {
        super(0, 0, 0, "green", 1, gameLogic.ctx);
        this.gameLogic = gameLogic
        this.canvas = gameLogic.canvas;
        this.ctx = gameLogic.ctx;
        this.center = gameLogic.center;
        this.player = gameLogic.player!;
        this.shrinkIntensity = 0.05;


        // Create a random position for enemy
        this.x = randomInitFromRange(-this.center.x, this.center.x);
        this.y = randomInitFromRange(-this.center.y, this.center.y);
        this.angle = Math.atan2(this.y, this.x);

        this.radius = randomInitFromRange(30, 60);
        this.targetRadius = this.radius;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;



        this.orbitOrbitRadius = Math.max(this.center.y + GameLogic.spawnOffset, this.center.x + GameLogic.spawnOffset);
    }


    update() {
        if (!GameLogic.isGameOver) {
            this.radius += (this.targetRadius - this.radius) * this.shrinkIntensity;

            if (this.targetRadius <= 5) { // player has killed enemy, remove enemy 
                const enemyIndex = GameLogic.enemies.indexOf(this);
                GameLogic.enemies.splice(enemyIndex, 1);
                GameLogic.gameScore++;
                this.gameLogic.setGameScoreOnUI();
                this.gameLogic.increaseGameDifficulty();
            }

            // check if enemy has hit player and end game
            const isCollide = Circle.detectCollision(this, this.player);
            if (isCollide) {
                this.gameLogic.gameOver();
            }

            this.orbitOrbitRadius = this.orbitOrbitRadius - Enemy.velocity;
        }



        // Update enemy values
        this.x = Math.cos(this.angle) * this.orbitOrbitRadius + this.center.x;
        this.y = Math.sin(this.angle) * this.orbitOrbitRadius + this.center.y;

        this.draw()
    }

    dispose() {
        window.clearInterval(Enemy.setIntervalId);
    }
}