import React, { useRef, useEffect } from 'react'

import { useWorld } from '@gengine/core'
import { threejsPlugin } from '@gengine/plugin-threejs'

import './debugView.scss'

export const DebugView = () => {
    const world = useWorld()
    const canvasContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const three = world?.getPlugin(threejsPlugin)
        if (three && canvasContainerRef.current) {
            three.resources.renderer.setDebugCanvasContainer(canvasContainerRef.current)
        }
        return () => {
            three?.resources.renderer.setDebugCanvasContainer(null)
        }
    }, [world])

    return (
        <div className="DebugView">
            <div ref={canvasContainerRef} />
        </div>
    )
}
