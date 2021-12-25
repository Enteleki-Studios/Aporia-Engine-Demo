import React, { useEffect } from 'react'

import { useAppDispatch } from 'hooks'

import Header from 'components/ingame/Header'

import type Dungeon from 'Dungeon'

const UI = ({ dungeon }: { dungeon: Dungeon }) => {
    const canvasRef = React.useRef(null)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dungeon.addDispatch(dispatch)

        if (canvasRef.current) {
            dungeon.init(canvasRef.current)
        }
    })

    return (
        <div className="UI">
            <Header />
            <canvas width={1280} height={720} ref={canvasRef} />
        </div>
    )
}

export default UI
