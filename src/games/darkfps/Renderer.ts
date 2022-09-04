import { StandardRenderer, DefaultGrid } from 'gengine'

export class Renderer extends StandardRenderer {
    constructor(params: { canvas: HTMLCanvasElement }) {
        super(params)

        this.setSize(1920, 1080)

        this.scene.add(new DefaultGrid(32, { text: 'Dark FPS' }))
    }
}
