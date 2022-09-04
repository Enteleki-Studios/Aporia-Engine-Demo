import React, { useEffect, useRef } from 'react'

import { init } from './darkfps'

const DarkUI = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (canvasRef.current) {
            init(canvasRef.current)
        }
    })
    return (
        <div className="DarkUI">
            <canvas ref={canvasRef} />
        </div>
    )
}

export default DarkUI
