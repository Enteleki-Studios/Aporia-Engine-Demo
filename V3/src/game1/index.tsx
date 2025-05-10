import { Inspector } from '@inspector'
import { useEffect, useRef } from 'react'

import { game1 } from './engineDef'
import './index.scss'

export const Invaders = () => {
    const canvasContainerRef = useRef(null)

    useEffect(() => {
        const engine = game1()
        engine.renderer.setCanvasContainer(canvasContainerRef.current)
    }, [])

    return (
        <Inspector passthrough>
            <div className="Invaders">
                <div className="hud">Score: 420</div>
                <div className="canvasContainer" ref={canvasContainerRef} />
            </div>
        </Inspector>
    )
}
