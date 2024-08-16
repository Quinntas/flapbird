import {Component} from "../lib/component";
import {Pipe} from "./pipe";
import {DrawRectangleLinesEx, GetRandomValue, Texture2D} from "raylib";
import {bird, engine} from "../infra/game";
import {NewVector2} from "../lib/utils";

export class PipeSpawner extends Component {
    private _pipes: Pipe[] = []

    private readonly upPipeTexture: Texture2D
    private readonly downPipeTexture: Texture2D

    private readonly spawnDelay: number = 2
    private spawnTimer: number = 0

    private readonly minPipeGap: number = 70
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

    private isBirdHitPipe() {
        const birdBox = {
            x: {xmin1: bird.position.x, xmax1: bird.position.x + bird.texture.width * 2.8},
            y: {ymin1: bird.position.y, ymax1: bird.position.y + bird.texture.width * 2.8}
        }

        DrawRectangleLinesEx(
            {
                x: birdBox.x.xmin1,
                y: birdBox.y.ymin1,
                width: bird.texture.width * 2.8,
                height: bird.texture.height * 2.8
            },
            2,
            {
                r: 255,
                g: 0,
                b: 0,
                a: 255
            }
        )

        for (let i = 0; i < this._pipes.length; i++) {
            const pipe = this._pipes[i]
            const pipeBox = {
                x: {xmin2: pipe.position.x, xmax2: pipe.position.x + pipe.texture.width * 0.5},
                y: {ymin2: pipe.position.y, ymax2: pipe.position.y + pipe.texture.width * 0.5}
            }
            DrawRectangleLinesEx(
                {
                    x: pipeBox.x.xmin2,
                    y: pipeBox.y.ymin2,
                    width: pipe.texture.width * 0.5,
                    height: pipe.texture.height * 0.5
                },
                2,
                {
                    r: 0,
                    g: 255,
                    b: 0,
                    a: 255
                }
            )

            if (this.isOverlapping2D(birdBox, pipeBox))
                return true
        }

        return false
    }

    private isOverlapping1D(xmax1: number, xmin2: number, xmax2: number, xmin1: number) {
        return xmax1 >= xmin2 && xmax2 >= xmin1
    }

    private isOverlapping2D(box1: any, box2: any) {
        return this.isOverlapping1D(box1.x.xmax1, box2.x.xmin2, box2.x.xmax2, box1.x.xmin1) &&
            this.isOverlapping1D(box1.y.ymax1, box2.y.ymin2, box2.y.ymax2, box1.y.ymin1)
    }

    update() {
        if (this.isBirdHitPipe())
            throw new Error('Game over')

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