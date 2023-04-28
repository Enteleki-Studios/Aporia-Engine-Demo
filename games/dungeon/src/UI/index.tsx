import React, { useEffect } from 'react'

// import Header from 'UI/components/ingame/Header'

import { init, updateCanvasContainer } from 'dungeon'

const UI = () => {
    const canvasContainerRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (canvasContainerRef.current) {
            updateCanvasContainer(canvasContainerRef.current)
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
