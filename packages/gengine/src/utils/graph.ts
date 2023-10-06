import './Graph.scss'

type GraphSettings = {
    name: string
    foreground: string
    foregroundNegative: string
    background: string
    width: number
    height: number
    colWidth: number
    min: number
    max: number
}

export class Graph {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D | null
    private domValue: HTMLSpanElement | undefined

    private settings: GraphSettings = {
        name: '',
        foreground: '#00ffff',
        foregroundNegative: '#ff00ff',
        background: '#121212',
        width: 120,
        height: 40,
        colWidth: 1,
        min: 0,
        max: 100,
    }

    private renderSettings = {
        range: 0,
        scale: 0,
        yAxisHeight: 0,
    }

    readonly domElement: HTMLDivElement

    constructor(settings?: Partial<GraphSettings>) {
        this.domElement = document.createElement('div')
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')

        this.domElement.classList.add('Graph')

        this.changeSettings(settings ?? {})

        if (this.settings.name) {
            this.domElement.classList.add('hasName')
            this.domElement.style.color = this.settings.foreground
            this.domElement.style.backgroundColor = this.settings.background
            this.domElement.textContent = this.settings.name

            this.domValue = document.createElement('span')
            this.domElement.appendChild(this.domValue)
        }

        this.domElement.appendChild(this.canvas)

        this.clear()
    }

    private updateDomValue(value: number) {
        if (this.domValue) {
            this.domValue.textContent = value.toString()
        }
    }

    clear() {
        if (this.context) {
            const { background, width, height } = this.settings

            this.context.fillStyle = background
            this.context.fillRect(0, 0, width, height)
        }
    }

    changeSettings(settings: Partial<GraphSettings>) {
        this.settings = { ...this.settings, ...settings }

        const { min, max, width, height } = this.settings

        const range = Math.abs(max - min)
        const scale = height / range
        const yAxisHeight = max * scale

        this.canvas.width = width
        this.canvas.height = height

        this.renderSettings.range = range
        this.renderSettings.scale = scale
        this.renderSettings.yAxisHeight = yAxisHeight
    }

    update(value: number) {
        if (this.domValue) {
            window.requestAnimationFrame(this.updateDomValue.bind(this, value))
        }

        if (this.context) {
            const { foreground, foregroundNegative, background, width, height, colWidth } = this.settings
            const { scale, yAxisHeight } = this.renderSettings

            this.context.drawImage(this.canvas, 0, 0, width, height, -colWidth, 0, width, height)

            this.context.fillStyle = background
            this.context.fillRect(width - colWidth, 0, colWidth, height)

            // Flip the sign to render up/down correctly on a canvas
            const colHeight = -value * scale
            this.context.fillStyle = colHeight > 0 ? foregroundNegative : foreground
            this.context.fillRect(width - colWidth, yAxisHeight, colWidth, colHeight)
        }
    }
}
