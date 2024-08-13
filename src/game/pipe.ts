import {Component} from "../lib/component";
import {DrawTextureEx, Texture2D, Vector2, Vector2Subtract, WHITE} from "raylib";
import {NewVector2} from "../lib/utils";

export class Pipe extends Component {
    private readonly _texture: Texture2D
    private _position: Vector2
    private readonly _speed: number = 200

    get position() {
        return this._position
    }

    constructor(texture: Texture2D, position: Vector2) {
        super("Pipe")
        this._texture = texture
        this._position = position
    }

    update() {
        this._position = Vector2Subtract(this.position, NewVector2(this._speed * this.frameTime, 0))
    }

    draw() {
        DrawTextureEx(this._texture, this._position, 0, 0.5, WHITE)
    }
}