import {
    Color,
    Texture,
} from 'three'

export interface CustomGridSettings {
    size?: number
    backgroundColor?: number
    borderColor?: number
    borderWidth?: number
    minorGridSegments?: number
    minorGridColor?: number
    minorGridWidth?: number
    text?: string
    lineHeight?: number
    font?: string
    textOffsetX?: number
    textOffsetY?: number
}

export class CustomGridTexture extends Texture {
    constructor({
        size = 512,
        backgroundColor = 0x212121,
        borderColor = 0xcccccc,
        borderWidth = 6,
        minorGridSegments = 4,
        minorGridColor = 0x666666,
        minorGridWidth = 4,
        text = 'Prototype',
        lineHeight = 25,
        font = 'Normal 18px monospace',
        textOffsetX = 15,
        textOffsetY = 30,
    }: CustomGridSettings = {}) {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size

        const gridCtx = canvas.getContext('2d')
        if (gridCtx) {
            // Backgound
            gridCtx.fillStyle = `#${new Color(backgroundColor).getHexString()}`
            gridCtx.fillRect(0, 0, size, size)

            // Minor grid
            gridCtx.fillStyle = `#${new Color(minorGridColor).getHexString()}`
            const mgWidth = size / minorGridSegments
            for (let i = 1; i < minorGridSegments; i += 1) {
                // Vertical line
                gridCtx.fillRect(mgWidth * i - minorGridWidth / 2, 0, minorGridWidth, size)
                // Horizontal line
                gridCtx.fillRect(0, mgWidth * i - minorGridWidth / 2, size, minorGridWidth)
            }

            // Border
            gridCtx.fillStyle = `#${new Color(borderColor).getHexString()}`
            gridCtx.lineWidth = borderWidth
            gridCtx.strokeStyle = `#${new Color(borderColor).getHexString()}`
            gridCtx.strokeRect(
                borderWidth / 2,
                borderWidth / 2,
                size - borderWidth,
                size - borderWidth,
            )

            // Text
            gridCtx.font = font
            text.split('\n').forEach((textFragment, i) => {
                gridCtx.fillText(textFragment, textOffsetX, textOffsetY + i * lineHeight)
            })
        }

        super(canvas)

        this.needsUpdate = true
    }
}
