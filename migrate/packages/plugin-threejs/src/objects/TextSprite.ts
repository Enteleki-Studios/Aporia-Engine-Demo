import { CanvasTexture, Sprite, SpriteMaterial } from 'three'

type Settings = {
    resolution?: number
    font?: string
    color?: string
    borderWidth?: number
    borderColor?: string
    scale?: number
}

export class TextSprite extends Sprite {
    private canvas: HTMLCanvasElement
    private settings: Settings
    private texture: CanvasTexture

    // TODO make this private
    text: string

    constructor(text: string | number, settings: Settings = {}) {
        const canvas = document.createElement('canvas')

        const tex = new CanvasTexture(canvas)
        tex.needsUpdate = true

        const spriteMat = new SpriteMaterial({
            map: tex,
        })

        super(spriteMat)
        this.texture = tex

        this.canvas = canvas

        this.text = text.toString()
        this.settings = settings

        this.drawTexture(true)
    }

    setText(text: string | number) {
        this.text = text.toString()
        this.drawTexture()
    }

    applySettings(settings: Settings) {
        this.settings = {
            ...this.settings,
            ...settings,
        }
        this.drawTexture()
    }

    drawTexture(isFirstTime = false) {
        const { canvas, text, settings } = this
        const {
            resolution = 40,
            font = 'monospace',
            color = 'white',
            borderWidth = 5,
            borderColor = 'black',
            scale = 0.25,
        } = settings
        const ctx = canvas.getContext('2d')

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const fontSetting = `${resolution}px ${font}`
            const lineWidth = borderWidth || 0
            ctx.font = fontSetting

            const { width } = ctx.measureText(text)
            if (isFirstTime) {
                // Account for border on both sides
                canvas.width = width + lineWidth * 2
                // Account for letters that dip below (gjpqy)
                canvas.height = resolution * 1.5
            }

            ctx.fillStyle = color
            ctx.strokeStyle = borderColor
            ctx.lineWidth = lineWidth
            ctx.font = fontSetting

            // Center text
            const left = (canvas.width - (width + lineWidth * 2)) / 2 + lineWidth
            ctx.strokeText(text, left, resolution)
            ctx.fillText(text, left, resolution)

            this.scale.set(
                (canvas.width / resolution) * scale,
                (canvas.height / resolution) * scale,
                1,
            )

            this.texture.needsUpdate = true
        }
    }
}
