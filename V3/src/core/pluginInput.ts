export const pluginInput = () => ({
    setup: () => {
        const input = {
            left: false,
            right: false,
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'KeyA') {
                input.left = true
            } else if (e.code === 'KeyD') {
                input.right = true
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'KeyA') {
                input.left = false
            } else if (e.code === 'KeyD') {
                input.right = false
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)

        return {
            input,
        }
    },
})
