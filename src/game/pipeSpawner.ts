import {Component} from "../lib/component";
import {Pipe} from "./pipe";
import {GetRandomValue, Texture2D} from "raylib";
import {engine} from "../infra/game";
import {NewVector2} from "../lib/utils";

export class PipeSpawner extends Component {
    private _pipes: Pipe[] = []

    private readonly upPipeTexture: Texture2D
    private readonly downPipeTexture: Texture2D

    private readonly spawnDelay: number = 2
    private spawnTimer: number = 0

    private readonly minPipeGap: number = 40
    private readonly maxPipeGap: number = 80

    private readonly minPipeOffset: number = 0
    private readonly maxPipeOffset: number = 100

    constructor(upPipeTexture: Texture2D, downPipeTexture: Texture2D) {
        super(`PipeSpawner`);
        this.upPipeTexture = upPipeTexture
        this.downPipeTexture = downPipeTexture
    }

    private spawn() {
        const pipeGap = GetRandomValue(this.minPipeGap, this.maxPipeGap)
        const operator = GetRandomValue(1, 5)

        let downPipeY = (-engine.screenCenter.y) - pipeGap
        let upPipeY = engine.screenCenter.y + pipeGap

        if (operator === 1) {
            const offset = GetRandomValue(this.minPipeOffset, this.maxPipeOffset)
            downPipeY += offset
            upPipeY += offset
        } else if (operator === 5) {
            const offset = GetRandomValue(this.minPipeOffset, this.maxPipeOffset)
            downPipeY -= offset
            upPipeY -= offset
        }

        this._pipes.push(
            new Pipe(this.downPipeTexture, NewVector2(engine.config.screen.width + this.downPipeTexture.width, downPipeY))
        )

        this._pipes.push(
            new Pipe(this.upPipeTexture, NewVector2(engine.config.screen.width + this.upPipeTexture.width, upPipeY))
        )
    }

    private isPipeOutOfScreen(pipe: Pipe) {
        return pipe.position.x < -this.upPipeTexture.width
    }

    private updatePipes() {
        for (let i = 0; i < this._pipes.length; i++) {
            this._pipes[i].callUpdate(this.frameTime)

            if (this.isPipeOutOfScreen(this._pipes[i]))
                this._pipes.splice(i, 1)
        }
    }

    private drawPipes() {
        for (let i = 0; i < this._pipes.length; i++) {
            this._pipes[i].callDraw()
        }
    }

    update() {
        this.spawnTimer -= this.frameTime

        if (this.spawnTimer <= 0) {
            this.spawn()
            this.spawnTimer = this.spawnDelay
        }

        this.updatePipes()
    }

    draw() {
        this.drawPipes()
    }
}