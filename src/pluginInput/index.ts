import type { Plugin } from '@core'

type Input = {
    left: boolean
    right: boolean
    space: boolean
}

export const pluginInput = (): Plugin<{ input: Input }> => ({
    createResources: () => {
        const input = {
            left: false,
            right: false,
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
            } else if (e.code === 'Enter') {
                input.space = true
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'KeyA') {
                input.left = false
            } else if (e.code === 'KeyD') {
                input.right = false
            } else if (e.code === 'Enter') {
                input.space = false
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
    },
})
