import { Texture, SpriteMaterial, Sprite } from 'three'

interface Settings {
    resolution?: number
    font?: string
    color?: string
    borderWidth?: number
    borderColor?: string
    scale?: number
}

export class TextSprite extends Sprite {
    private canvas: HTMLCanvasElement
    private text: string
    private settings: Settings

    constructor(text: string, settings: Settings = {}) {
        const canvas = document.createElement('canvas')

        const tex = new Texture(canvas)
        tex.needsUpdate = true

        const spriteMat = new SpriteMaterial({
            map: tex,
        })

        super(spriteMat)

        this.canvas = canvas

        this.text = text
        this.settings = settings

        this.drawTexture()
    }

    setText(text: string) {
        this.text = text
        this.drawTexture()
    }

    applySettings(settings: Settings) {
        this.settings = {
            ...this.settings,
            ...settings,
        }
        this.drawTexture()
    }

    drawTexture() {
        const { canvas, text, settings } = this
        const {
            resolution = 40,
            font = 'mono',
            color = 'white',
            borderWidth = 5,
            borderColor = 'black',
            scale = 0.25,
        } = settings
        const ctx = canvas.getContext('2d')

        if (ctx) {
            const fontSetting = `${resolution}px ${font}`
            const lineWidth = borderWidth || 0
            ctx.font = fontSetting

            const { width } = ctx.measureText(text)
            // Account for border on both sides
            canvas.width = width + (lineWidth * 2)
            // Account for letters that dip below (gjpqy)
            canvas.height = resolution * 1.5

            ctx.fillStyle = color
            ctx.strokeStyle = borderColor
            ctx.lineWidth = lineWidth
            ctx.font = fontSetting

            ctx.strokeText(text, lineWidth, resolution)
            ctx.fillText(text, lineWidth, resolution)

            this.scale.set(
                (canvas.width / resolution) * scale,
                (canvas.height / resolution) * scale,
                1,
            )
        }
    }
}
