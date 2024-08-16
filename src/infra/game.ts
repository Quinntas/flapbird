import {Engine} from "../lib/engine";
import {LoadTexture} from "raylib";
import {Bird} from "../game/bird";
import {PipeSpawner} from "../game/pipeSpawner";

export const engine: Engine = new Engine({
    screen: {
        width: 800,
        height: 450,
        title: "Flappy Bird"
    },
    targetFps: 144
});

const birdTexture = LoadTexture("resources/bird.png")
export const bird = new Bird(birdTexture);

const upPipeTexture = LoadTexture("resources/pipe_up.png")
const downPipeTexture = LoadTexture("resources/pipe_down.png")
const pipeSpawner = new PipeSpawner(upPipeTexture, downPipeTexture)

engine.use(bird)
engine.use(pipeSpawner)
