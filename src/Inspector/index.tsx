import React, { useRef, useEffect } from 'react'

import Dungeon from 'Dungeon'

import './index.scss'

interface Props {
    dungeon: Dungeon,
}

const Inspector = ({ dungeon }: Props) => {
    const canvasRef = React.useRef(null)
    useEffect(() => {
        if (canvasRef.current) {
            dungeon.init(canvasRef.current)
        }
    }, [])
    return (
        <div className="Inspector">
            <div className="header">Inspector</div>
            <div className="sidepanel">Sidepanel</div>
            <div className="preview">
                Preview
                <canvas ref={canvasRef} />
            </div>
            <div className="log">Log</div>
        </div>
    )
}

export default Inspector
