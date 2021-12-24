import React, { useEffect } from 'react'

import { useAppDispatch } from 'hooks'

import Header from 'components/ingame/Header'

import Dungeon from 'Dungeon'

const dungeon: Dungeon = new Dungeon()

const UI = () => {
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
