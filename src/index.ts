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
    private readonly flipped: boolean

    getPosition() {
        return this.position
    }

    constructor(texture: r.Texture2D, position: r.Vector2, flipped: boolean) {
        this.texture = texture
        this.flipped = flipped
        this.position = position
    }

    update(frameTime: number) {
        this.position = Vector2Subtract(this.position, {x: this.speed * frameTime, y: 0})
    }

    draw() {
        const rotation = this.flipped ? 180 : 0
        r.DrawTextureEx(this.texture, this.position, rotation, 0.5, r.WHITE)
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
    private pipeTexture = r.LoadTexture("../resources/pipe.png")
    private spawnDelay = 1;
    private readonly minPipeGap = 30
    private readonly maxPipeGap = 60

    constructor() {
        this.pipes = []
    }

    spawn() {
        const x = screenWidth + this.pipeTexture.width
        const pipeGap = r.GetRandomValue(this.minPipeGap, this.maxPipeGap)
        this.pipes.push(new Pipe(this.pipeTexture, {x, y: screenCenter.y - pipeGap}, true))
        this.pipes.push(new Pipe(this.pipeTexture, {x, y: screenCenter.y + pipeGap}, false))
    }

    update(frameTime: number) {
        this.spawnDelay -= frameTime

        if (this.spawnDelay <= 0) {
            this.spawn()
            this.spawnDelay = 2
        }

        for (let i = 0; i < this.pipes.length; i++) {
            this.pipes[i].update(frameTime)

            if (this.pipes[i].getPosition().x < -this.pipeTexture.width)
                this.pipes.splice(i, 1)
        }
    }

    draw() {
        for (const pipe of this.pipes) {
            console.log(pipe.getPosition())
            pipe.draw()
        }
    }
}

const bird = new Bird(r.LoadTexture("../resources/bird.png"))
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