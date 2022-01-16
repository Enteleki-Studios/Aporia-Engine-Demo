import { Texture, SpriteMaterial, Sprite } from 'three'

interface Settings {
    [key: string]: (number | string | undefined)
    fontSize?: number
}

export class TextSprite extends Sprite {
    [key: keyof Settings]: any
    canvas: HTMLCanvasElement
    fontSize: number

    constructor(text: string, settings: Settings = {}) {
        const canvas = document.createElement('canvas')

        const tex = new Texture(canvas)
        tex.needsUpdate = true

        const spriteMat = new SpriteMaterial({
            map: tex,
        })

        super(spriteMat)

        this.center.set(0.5, 0) // Set origin to center bottom

        this.canvas = canvas
        this.fontSize = 40

        this.setValues(settings)

        this.setText(text)
    }

    setText(text: string) {
        const { canvas } = this
        const ctx = canvas.getContext('2d')

        if (ctx) {
            const fontSize = 40
            const lineWidth = Math.round(fontSize / 8)
            ctx.font = `${fontSize}px serif`

            const { width } = ctx.measureText(text)
            canvas.width = width + (lineWidth * 2)
            canvas.height = fontSize * 1.4

            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'black'
            ctx.lineWidth = lineWidth
            ctx.font = `${fontSize}px serif`

            ctx.strokeText(text, lineWidth, fontSize)
            ctx.fillText(text, lineWidth, fontSize)

            const scale = fontSize * 4
            this.scale.set(canvas.width / scale, canvas.height / scale, 1)
        }
    }

    setValues(settings: Settings) {
        Object.keys(settings).forEach((key) => {
            const nextValue = settings[key]
            if (nextValue) {
                this[key] = nextValue
            }
        })
    }
}
