import {
    BeginDrawing,
    ClearBackground,
    CloseWindow,
    EndDrawing,
    GetFrameTime,
    GetTime,
    InitWindow,
    RAYWHITE,
    SetRandomSeed,
    SetTargetFPS,
    Vector2,
    WindowShouldClose
} from "raylib";
import {Component} from "./component";

interface Config {
    screen: {
        width: number
        height: number
        title: string
    }
    targetFps: number
}

export class Engine {
    private readonly _config: Config
    private readonly _screenCenter: Vector2
    private _components: Component[] = []

    get screenCenter(): Vector2 {
        return this._screenCenter
    }

    get config(): Config {
        return this._config
    }

    use(component: Component) {
        this._components.push(component)
    }

    constructor(cfg: Config) {
        SetRandomSeed(GetTime())
        this._config = cfg
        this._screenCenter = {x: this._config.screen.width / 2, y: this._config.screen.height / 2}

        this.init()
    }

    private init() {
        SetTargetFPS(this._config.targetFps)
        InitWindow(this._config.screen.width, this._config.screen.height, this._config.screen.title)
    }

    start() {
        while (!WindowShouldClose()) {
            const frameTime = GetFrameTime()

            for (let i = 0; i < this._components.length; i++) {
                this._components[i].callUpdate(frameTime)
            }

            BeginDrawing();
            ClearBackground(RAYWHITE)

            for (let i = 0; i < this._components.length; i++) {
                this._components[i].callDraw()
            }

            EndDrawing()
        }

        this.close()
    }

    close() {
        CloseWindow()
    }
}