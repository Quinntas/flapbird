export abstract class Component {
    private readonly _name: string
    private _frameTime: number = 0

    get frameTime(): number {
        return this._frameTime
    }

    get name(): string {
        return this._name
    }

    protected constructor(name: string) {
        this._name = name
    }

    callUpdate(frameTime: number): void {
        this._frameTime = frameTime
        this.update()
    }

    callDraw(): void {
        this.draw()
    }

    abstract update(): void

    abstract draw(): void
}