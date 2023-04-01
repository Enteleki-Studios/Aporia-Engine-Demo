import React, { useEffect } from 'react'

// import Header from 'UI/components/ingame/Header'

import { init, renderer } from 'dungeon'

const UI = () => {
    const canvasContainerRef = React.useRef(null)

    useEffect(() => {
        if (canvasContainerRef.current) {
            renderer.setCanvasContainer(canvasContainerRef.current)
            init()
        }
    }, [])

    return (
        <div className="UI">
            <div className="reticle" />
            <div ref={canvasContainerRef} />
        </div>
    )
}

export default UI
