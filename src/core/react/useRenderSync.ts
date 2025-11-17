import { useEffect, useState } from 'react'

import { type AnySystem } from '@core'

import { useWorld } from '.'

export const useRenderSync = () => {
    const world = useWorld()
    const [_, setFrame] = useState(0)

    useEffect(() => {
        const onFrame: AnySystem = (w) => {
            setFrame(w.clock.frames)
        }

        world.addSystem(onFrame)

        return () => {
            world.removeSystem(onFrame)
        }
    }, [world])
}
