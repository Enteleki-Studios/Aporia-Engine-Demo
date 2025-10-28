import { Inspector } from '@inspector'
import { useEffect, useRef, useState } from 'react'

import { WorldContext } from '@core/react'

import { game1 } from './engineDef'
import { useGameWorld } from './hooks'
import './index.scss'

const engine = game1()
export type World = typeof engine

const Game = () => {
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

export const Invaders = () => {
    const [isPassthrough, setIsPassthrough] = useState(false)

    useEffect(() => {
        const togglePassthroughMode = (event: KeyboardEvent) => {
            if (event.code === 'Backquote') {
                setIsPassthrough((prev) => !prev)
            }
        }

        document.addEventListener('keydown', togglePassthroughMode)

        return () => {
            document.removeEventListener('keydown', togglePassthroughMode)
        }
    }, [])

    return (
        <WorldContext value={engine}>
            <Inspector passthrough={isPassthrough}>
                <Game />
            </Inspector>
        </WorldContext>
    )
}
