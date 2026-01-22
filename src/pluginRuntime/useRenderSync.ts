import { useEffect, useState } from 'react'

import { type System } from '@core'

import { useRuntimeWorld } from './runtimePanel'

export const useRenderSync = () => {
    const world = useRuntimeWorld()
    const [_, setFrame] = useState(0)

    useEffect(() => {
        const onFrame: System<typeof world> = (w) => {
            setFrame(w.clock.frames)
        }

        world.runtime.addDebugSystem(onFrame)

        return () => {
            world.runtime.removeDebugSystem(onFrame)
        }
    }, [world])
}
