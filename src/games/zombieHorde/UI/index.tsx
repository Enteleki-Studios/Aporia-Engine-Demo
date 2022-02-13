import React, { useEffect } from 'react'

import Header from 'UI/components/ingame/Header'

import type { ZombieHorde } from 'zombieHorde'

const UI = ({ zombieHorde }: { zombieHorde: ZombieHorde }) => {
    const canvasRef = React.useRef(null)
    useEffect(() => {
        if (canvasRef.current) {
            zombieHorde.init(canvasRef.current)
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
