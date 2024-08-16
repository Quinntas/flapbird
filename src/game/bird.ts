import {Component} from "../lib/component";
import {
    DrawTextureEx,
    IsKeyPressed,
    KEY_SPACE,
    Texture2D,
    Vector2,
    Vector2Add,
    Vector2Scale,
    Vector2Zero,
    WHITE
} from "raylib";
import {engine} from "../infra/game";
import {NewVector2} from "../lib/utils";

export class Bird extends Component {
    private readonly _texture: Texture2D

    private _position: Vector2
    private _velocity: Vector2

    private readonly _gravityPullSpeed: number = 600
    private readonly _floorHeight: number = engine.config.screen.height - 100
    private readonly _jumpHeight: number = 250

    private readonly _jumpKey: number = KEY_SPACE

    get texture() {
        return this._texture
    }

    get position() {
        return this._position
    }

    constructor(texture: Texture2D) {
        super("Bird");
        this._texture = texture;
        this._position = this.initial_position();
        this._velocity = Vector2Zero()
    }

    private initial_position() {
        return NewVector2(50, engine.screenCenter.y)
    }

    update() {
        const keyPressed = IsKeyPressed(this._jumpKey);

        if (this._position.y >= this._floorHeight && !keyPressed) {
            this._position = NewVector2(this._position.x, this._floorHeight)
            return
        }

        if (keyPressed)
            this._velocity = {x: 0, y: -this._jumpHeight}

        this._velocity = Vector2Add(this._velocity, NewVector2(0, this._gravityPullSpeed * this.frameTime))
        this._position = Vector2Add(this._position, Vector2Scale(this._velocity, this.frameTime))
    }

    draw() {
        DrawTextureEx(this._texture, this._position, 0, 2.8, WHITE)
    }
}