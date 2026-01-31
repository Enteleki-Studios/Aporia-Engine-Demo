import { useEffect, useRef } from 'react'

import { useGameWorld } from './hooks'

export const Game = () => {
    const canvasContainerRef = useRef(null)
    const world = useGameWorld()

    useEffect(() => {
        world.runtime.start()

        return () => {
            world.runtime.stop()
        }
    }, [world])

    useEffect(() => {
        world.three.renderer.setCanvasContainer(canvasContainerRef.current)
        world.input.setInputElement(canvasContainerRef.current)

        return () => {
            world.three.renderer.setCanvasContainer(null)
            world.input.setInputElement(null)
        }
    }, [world])

    return (
        <div className="Invaders">
            <div className="hud">Score: 420</div>
            <div className="canvasContainer" ref={canvasContainerRef} tabIndex={0} />
        </div>
    )
}
