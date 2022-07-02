import React, { useEffect } from 'react'

// import { useAppDispatch } from 'hooks'

// import Header from 'UI/components/ingame/Header'

import { init } from 'dungeon/dungeon'

const UI = () => {
    const canvasRef = React.useRef(null)
    // const dispatch = useAppDispatch()
    useEffect(() => {
        // dungeon.addDispatch(dispatch)

        if (canvasRef.current) {
            init(canvasRef.current)
        }
    })

    return (
        <div className="UI">
            {/* <Header /> */}
            <canvas ref={canvasRef} />
        </div>
    )
}

export default UI
