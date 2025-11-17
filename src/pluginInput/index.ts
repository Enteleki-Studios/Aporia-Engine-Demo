import type { Plugin } from '@core'

type Input = {
    left: boolean
    right: boolean
    up: boolean
    down: boolean
    space: boolean
}

export const pluginInput = (): Plugin<{ input: Input }> => ({
    createResources: () => {
        const input = {
            left: false,
            right: false,
            up: false,
            down: false,
            space: false,
        }

        return {
            input,
        }
    },
    init(runtime) {
        const { input } = runtime.resources

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'KeyA') {
                input.left = true
            } else if (e.code === 'KeyD') {
                input.right = true
            } else if (e.code === 'KeyW') {
                input.up = true
            } else if (e.code === 'KeyS') {
                input.down = true
            } else if (e.code === 'Enter') {
                input.space = true
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'KeyA') {
                input.left = false
            } else if (e.code === 'KeyD') {
                input.right = false
            } else if (e.code === 'KeyW') {
                input.up = false
            } else if (e.code === 'KeyS') {
                input.down = false
            } else if (e.code === 'Enter') {
                input.space = false
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
    },
})
