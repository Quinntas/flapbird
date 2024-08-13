import * as r from "raylib"
import {Vector2Add, Vector2Scale, Vector2Subtract} from "raylib"

const screenWidth = 800
const screenHeight = 450
const screenCenter = {x: screenWidth / 2, y: screenHeight / 2}

r.InitWindow(screenWidth, screenHeight, "Flappy Bird")
r.SetTargetFPS(144)

class Pipe {
    private position: r.Vector2
    private readonly texture: r.Texture2D
    private readonly speed: number = 200

    getPosition() {
        return this.position
    }

    constructor(texture: r.Texture2D, position: r.Vector2) {
        this.texture = texture
        this.position = position
    }

    update(frameTime: number) {
        this.position = Vector2Subtract(this.position, {x: this.speed * frameTime, y: 0})
    }

    draw() {
        r.DrawTextureEx(this.texture, this.position, 0, 0.5, r.WHITE)
    }
}

class Bird {
    private position: r.Vector2
    private velocity: r.Vector2
    private readonly texture: r.Texture2D

    private readonly gravityPullSpeed: number = 600
    private readonly floorHeight: number = screenHeight - 100
    private readonly jumpHeight: number = 250

    constructor(texture: r.Texture2D) {
        this.texture = texture
        this.position = {
            x: 50,
            y: screenCenter.y
        }
        this.velocity = {x: 0, y: 0}
    }

    update(frameTime: number) {
        if (this.position.y >= this.floorHeight && !r.IsKeyPressed(r.KEY_SPACE)) {
            this.position = {x: this.position.x, y: this.floorHeight}
            return
        }

        if (r.IsKeyPressed(r.KEY_SPACE))
            this.velocity = {x: 0, y: -this.jumpHeight}

        this.velocity = Vector2Add(this.velocity, {x: 0, y: this.gravityPullSpeed * frameTime})
        this.position = Vector2Add(this.position, Vector2Scale(this.velocity, frameTime))
    }

    draw() {
        r.DrawTextureEx(this.texture, this.position, 0, 2.8, r.WHITE)
    }
}

class PipeManager {
    private readonly pipes: Pipe[]
    private upPipeTexture = r.LoadTexture("resources/pipe_up.png")
    private downPipeTexture = r.LoadTexture("resources/pipe_down.png")
    private spawnDelay = 1;
    private readonly minPipeGap = 40
    private readonly maxPipeGap = 80

    constructor() {
        this.pipes = []
    }

    spawn() {
        const pipeGap = r.GetRandomValue(this.minPipeGap, this.maxPipeGap)
        const operator = r.GetRandomValue(1, 3)

        let downPipeY = ((-screenCenter.y) - pipeGap)
        let upPipeY = (screenCenter.y + pipeGap)

        if (operator === 2) {
            const offset = r.GetRandomValue(0, 100)
            downPipeY += offset
            upPipeY += offset
        } else if (operator === 3) {
            const offset = r.GetRandomValue(0, 100)
            downPipeY -= offset
            upPipeY -= offset
        }

        this.pipes.push(
            new Pipe(this.downPipeTexture, {
                x: screenWidth + this.downPipeTexture.width,
                y: downPipeY
            })
        )
        this.pipes.push(
            new Pipe(this.upPipeTexture, {
                x: screenWidth + this.upPipeTexture.width,
                y: upPipeY
            })
        )
    }

    update(frameTime: number) {
        this.spawnDelay -= frameTime

        if (this.spawnDelay <= 0) {
            this.spawn()
            this.spawnDelay = 2
        }

        for (let i = 0; i < this.pipes.length; i++) {
            this.pipes[i].update(frameTime)

            if (this.pipes[i].getPosition().x < -this.upPipeTexture.width)
                this.pipes.splice(i, 1)
        }
    }

    draw() {
        for (const pipe of this.pipes) {
            pipe.draw()
        }
    }
}

r.SetRandomSeed(r.GetTime())

const bird = new Bird(r.LoadTexture("resources/bird.png"))
const pipeManager = new PipeManager()

while (!r.WindowShouldClose()) {
    const frameTime = r.GetFrameTime()

    pipeManager.update(frameTime)
    bird.update(frameTime)

    r.BeginDrawing();
    r.ClearBackground(r.RAYWHITE)

    pipeManager.draw()
    bird.draw()

    r.EndDrawing()
}

r.CloseWindow()