import React, { useEffect, useRef } from 'react'

import { useWorld } from '@gengine/core'
import { ThreejsPlugin } from '@gengine/plugin-threejs'

import './debugView.scss'

export const DebugView = () => {
    const world = useWorld()
    const canvasContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const three = world?.getPlugin(ThreejsPlugin)
        if (three && canvasContainerRef.current) {
            three.renderer.setDebugCanvasContainer(canvasContainerRef.current)
        }
        return () => {
            three?.renderer.setDebugCanvasContainer(null)
        }
    }, [world])

    return (
        <div className="DebugView">
            <div ref={canvasContainerRef} />
        </div>
    )
}
