import { useEffect, useState } from 'react'

import { type System } from '@enteleki-studios/aporia-engine-core'

import { useRuntimeWorld } from './runtimePanel'

export const useRenderSync = () => {
    const world = useRuntimeWorld()
    const [_, setCounter] = useState(0)

    useEffect(() => {
        const cb: System<typeof world> = () => {
            setCounter((prev) => prev + 1)
        }

        world.runtime.addDebugSystem(cb)

        return () => {
            world.runtime.removeDebugSystem(cb)
        }
    }, [world])
}
