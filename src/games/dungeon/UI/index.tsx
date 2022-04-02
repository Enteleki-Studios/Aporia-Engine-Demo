import React, { useEffect } from 'react'

import { useAppDispatch } from 'hooks'

// import Header from 'UI/components/ingame/Header'

import dungeon from 'dungeon/dungeon'

const UI = () => {
    const canvasRef = React.useRef(null)
    const debugCanvasRef = React.useRef(null)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dungeon.addDispatch(dispatch)

        if (canvasRef.current && debugCanvasRef.current) {
            dungeon.init(canvasRef.current, debugCanvasRef.current)
        }
    })

    return (
        <div className="UI">
            {/* <Header /> */}
            <div className="canvasContainer">
                <canvas ref={canvasRef} />
            </div>
            <div className="canvasContainer">
                <canvas ref={debugCanvasRef} />
            </div>
        </div>
    )
}

export default UI
