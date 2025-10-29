import { ReactNode, useEffect, useState } from 'react'

import './inspector.scss'
import { useWorld } from '@core/react'
import { AnySystem } from '@core'

type InspectorProps = {
    children: ReactNode
    passthrough?: boolean
}

export const Inspector = ({ children, passthrough }: InspectorProps) => {
    const world = useWorld()
    const [frame, setFrame] = useState(0)

    useEffect(() => {
        const onFrame: AnySystem = (w) => {
            setFrame(w.resources.clock.frame)
        }

        world.addSystem(onFrame)

        return () => {
            world.removeSystem(onFrame)
        }
    }, [world])

    if (passthrough) {
        return children
    }

    return (
        <div className="Inspector">
            <div className="header">Inspector</div>
            <div className="sidepanel">
                <h3>Sidepanel</h3>
                <pre>FPS: {world.resources.clock.fps}</pre>
                <pre>Frame: {frame}</pre>
                <pre>Entities: {world.resources.entities.length}</pre>
            </div>
            <div className="explorer">
                <h3>Resources</h3>
                <pre>{JSON.stringify(world.resources, Object.keys(world.resources), 2)}</pre>
            </div>
            <div className="views">
                <div className="game">{children}</div>
            </div>
            <footer>Enteleki Studios</footer>
        </div>
    )
}
