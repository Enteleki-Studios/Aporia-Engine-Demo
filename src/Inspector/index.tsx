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
            <div className="header">ECS Inspector</div>
            <div className="sidepanel">Entities</div>
            <div className="preview">
                <div className="canvasContainer">
                    <canvas width={1280} height={720} ref={canvasRef} />
                </div>
            </div>
            <div className="log">Log</div>
        </div>
    )
}

export default Inspector
