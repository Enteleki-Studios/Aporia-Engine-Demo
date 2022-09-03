import React, { useEffect, useRef } from 'react'

import { init } from './example'

const ExampleUI = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (canvasRef.current) {
            init(canvasRef.current)
        }
    })
    return (
        <div className="ExampleUI">
            <canvas ref={canvasRef} />
        </div>
    )
}

export default ExampleUI
