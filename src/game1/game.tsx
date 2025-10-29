import { useEffect, useRef } from 'react'

import { useGameWorld } from './hooks'

export const Game = () => {
    const canvasContainerRef = useRef(null)
    const world = useGameWorld()

    useEffect(() => {
        world.start()

        return () => {
            world.stop()
        }
    }, [world])

    useEffect(() => {
        world.resources.three.renderer.setCanvasContainer(canvasContainerRef.current)

        return () => {
            world.resources.three.renderer.setCanvasContainer(null)
        }
    }, [world])

    return (
        <div className="Invaders">
            <div className="hud">Score: 420</div>
            <div className="canvasContainer" ref={canvasContainerRef} />
        </div>
    )
}
