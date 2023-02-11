import Enemy from "./Enemy";
import Player from "./Player";
import ProjectileImpact from "./ProjectileImpact";
import { Vector2 } from "./types";

const frame1 = "Frame1"
const frame2 = "Frame2"

export default class GameLogic {
    static _instance: GameLogic | null;
    static enemies: Enemy[];
    static spawnOffset: number;
    static gameScore: number;
    static isGameOver: boolean;
    animationRef!: number;
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    player!: Player;
    center!: Vector2;
    resizeHandler: any;
    constructor() {
        // Set up class as a singleton
        if (GameLogic._instance) {
            return GameLogic._instance
        }

        // init
        GameLogic.spawnOffset = 100;
        GameLogic.gameScore = 0;
        GameLogic.isGameOver = false;
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d')!
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        }

        console.log("init")

        this.player = new Player(this);

        GameLogic.enemies = [];
        Enemy.colors = [
            "#2185C5",
            "#7ECEFD",
            "#FFF6E5",
            "#FF7F66"
        ];
        Enemy.spawIntervalCount = 3000;
        Enemy.velocity = 0.5;
        Enemy.setIntervalId = window.setInterval(() => {
            GameLogic.enemies.push(new Enemy(this))
        }, Enemy.spawIntervalCount)

        this.resizeHandler = this.resize.bind(this);
        window.addEventListener("resize", this.resizeHandler);
        document.onvisibilitychange = () => {
            if (document.visibilityState === "hidden") {
                // user closed tab, stop creating enemies
                window.clearInterval(Enemy.setIntervalId);
            } else {
                // user open tab resuming enemy creation
                Enemy.setIntervalId = window.setInterval(() => {
                    GameLogic.enemies.push(new Enemy(this))
                }, Enemy.spawIntervalCount);
            }
        }

        this.update();

        GameLogic._instance = this;
    }

    setGameScoreOnUI() {
        const spanEle = document.querySelector("#gameScore") as HTMLSpanElement
        spanEle.innerText = `${GameLogic.gameScore}`
    }

    increaseGameDifficulty() {
        // Increase player difficulty if...
        if (GameLogic.gameScore % 5 === 0) {
            Enemy.spawIntervalCount = Math.max(1000, Enemy.spawIntervalCount - 200);
            window.clearInterval(Enemy.setIntervalId);
            Enemy.setIntervalId = window.setInterval(() => {
                GameLogic.enemies.push(new Enemy(this))
            }, Enemy.spawIntervalCount);
            Enemy.velocity += 0.1;
        }
    }

    gameOver() {
        GameLogic.isGameOver = true;
        this.player.gameOver()

        // reset UI values
        const spanEle = document.querySelector("#gameScore") as HTMLSpanElement
        const gameOverWrapper = document.getElementById("gameOverWrapper") as HTMLDivElement;
        const gameOverScore = gameOverWrapper.querySelector("#gameOverScore") as HTMLSpanElement;
        gameOverScore.innerText = `Score: ${GameLogic.gameScore}`
        gameOverWrapper.style.display = "flex"
        spanEle.innerText = `${0}`

        window.cancelAnimationFrame(this.animationRef)
        window.clearInterval(Enemy.setIntervalId)

        Enemy.spawIntervalCount = 3000;
        Enemy.velocity = 0.4;
        GameLogic.gameScore = 0;

    }

    restartGame() {
        const gameOverWrapper = document.getElementById("gameOverWrapper") as HTMLDivElement;
        const spanEle = document.querySelector("#gameScore") as HTMLSpanElement
        gameOverWrapper.style.display = "none";
        spanEle.innerText = `${0}`

        // Reset all values
        this.player.gameRestart()
        GameLogic.enemies = [];
        GameLogic.isGameOver = false;
        GameLogic.gameScore = 0;

        ProjectileImpact.particles = [];

        Enemy.spawIntervalCount = 4000;
        Enemy.velocity = 0.5;
        Enemy.setIntervalId = window.setInterval(() => {
            GameLogic.enemies.push(new Enemy(this))
        }, Enemy.spawIntervalCount);


        this.update();
    }


    update() {
        this.animationRef = window.requestAnimationFrame(this.update.bind(this))
        this.ctx.fillStyle = `rgba(0,0,0,0.1)`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)


        this.player.update();
        GameLogic.enemies.forEach(enemy => {
            enemy.update();
        })

    }

    resize() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.center.x = this.canvas.width / 2;
        this.center.y = this.canvas.height / 2;


        this.player.resize();
    }

    dispose() {
        console.log("disposed Canvas");
        window.cancelAnimationFrame(this.animationRef);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.dispose();
        window.removeEventListener("resize", this.resizeHandler);
        window.clearInterval(Enemy.setIntervalId)
        GameLogic._instance = null;
    }
}