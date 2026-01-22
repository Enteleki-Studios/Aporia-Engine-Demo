import { useEffect, useState } from 'react'

import { type AnySystem } from '@core'

import { useWorld } from '.'

export const useRenderSync = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- World<any> is intentional
    const world = useWorld()
    const [_, setFrame] = useState(0)

    useEffect(() => {
        const onFrame: AnySystem = (w) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- World<any> is intentional
            setFrame(w.runtime.clock.frames)
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- World<any> is intentional
        world.runtime.addDebugSystem(onFrame)

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- World<any> is intentional
            world.runtime.removeDebugSystem(onFrame)
        }
    }, [world])
}
