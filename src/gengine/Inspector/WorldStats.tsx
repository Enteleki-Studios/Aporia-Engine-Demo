import React, { useCallback, useContext, useEffect, useState } from 'react'

import { WorldContext } from '../react/WorldContext'

export const WorldStats = () => {
    const world = useContext(WorldContext)
    const [stats, setStats] = useState('')

    const updateStats = useCallback(() => {
        setStats(world.getStats())
    }, [world])

    useEffect(() => {
        world.addEventListener('endframe', updateStats)
    }, [world, updateStats])

    return (
        <div className="WorldStats">
            {stats}
        </div>
    )
}
