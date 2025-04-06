import { createWorld, createPlugin } from '@core'

const pluginThree = createPlugin('threejs', ({test}: { test: string}) => () => {
    return {
        renderer: { t: test}
    }
})

export const game1 = () => {
    const world = createWorld({
        plugins: [
            pluginThree({ test: 'hey' }),
        ],
    })

    console.debug(world)
}
