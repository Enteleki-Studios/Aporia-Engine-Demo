import React, { useEffect, useRef } from 'react'

import { useWorld } from '@gengine/core'
import { threejsPlugin } from '@gengine/plugin-threejs'

// import Header from 'UI/components/ingame/Header'

import { init } from 'dungeon'

const UI = () => {
    const world = useWorld()
    const canvasContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const three = world?.getPlugin(threejsPlugin)
        if (three && canvasContainerRef.current) {
            three.resources.renderer.setCanvasContainer(canvasContainerRef.current)
            init()
        }
        return () => {
            three?.resources.renderer.setCanvasContainer(null)
        }
    }, [world])

    return (
        <div className="UI">
            <div ref={canvasContainerRef} />
        </div>
    )
}

export default UI
