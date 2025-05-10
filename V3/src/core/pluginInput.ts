export const pluginInput = () => ({
    setup: () => {
        const input = {
            left: false,
            right: false,
            space: false,
        }

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

        return {
            input,
        }
    },
})
