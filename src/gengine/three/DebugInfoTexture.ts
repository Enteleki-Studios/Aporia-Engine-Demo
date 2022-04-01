import { Texture, WebGLRenderer } from 'three'

const X_OFFSET = 5

export class DebugInfoTexture extends Texture {
    private canvas
    private context
    private lineOffset
    private lineHeight

    constructor(width: number, height: number) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')
        if (context) {
            context.font = `Normal ${height / 72}px monospace`
            context.fillStyle = 'rgba(255, 255, 255, 0.7)'
            context.fillText('Initializing...', 5, 15)
        }

        super(canvas)

        this.needsUpdate = true

        this.canvas = canvas
        this.context = context

        this.lineHeight = height / 60
        this.lineOffset = this.lineHeight
    }

    update(data: {
        delta?: number
        renderer?: WebGLRenderer
    } = {}) {
        this.lineOffset = this.lineHeight

        if (this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

            const { delta, renderer } = data

            if (delta) {
                this.writeLine(`${Math.floor(1 / delta)} fps`)
            }

            if (renderer) {
                this.writeLine(`geometries: ${renderer.info.memory.geometries}`)
                this.writeLine(`textures: ${renderer.info.memory.textures}`)
                this.writeLine(`calls: ${renderer.info.render.calls}`)
                this.writeLine(`triangles: ${renderer.info.render.triangles}`)
            }

            this.needsUpdate = true
        }
    }

    private writeLine(text: string) {
        this.context?.fillText(text, X_OFFSET, this.lineOffset)
        this.lineOffset += this.lineHeight
    }
}
