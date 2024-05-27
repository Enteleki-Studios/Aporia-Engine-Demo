import React, { useEffect, useRef } from 'react'

import { useWorld } from '@gengine/core'
import { ThreejsPlugin } from '@gengine/plugin-threejs'

// import Header from 'UI/components/ingame/Header'
import { init } from '~/dungeon'

const UI = () => {
    const world = useWorld()
    const canvasContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const three = world?.getPlugin(ThreejsPlugin)
        if (three && canvasContainerRef.current) {
            three.renderer.setCanvasContainer(canvasContainerRef.current)
            init()
        }
        return () => {
            three?.renderer.setCanvasContainer(null)
        }
    }, [world])

    return (
        <div className="UI">
            <div ref={canvasContainerRef} />
        </div>
    )
}

export default UI
