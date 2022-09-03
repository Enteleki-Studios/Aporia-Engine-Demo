import React, { useCallback, useContext, useEffect, useState } from 'react'

import { StatsType } from '../World'
import { WorldContext } from '../react/WorldContext'

import './WorldStats.scss'

export const WorldStats = () => {
    const world = useContext(WorldContext)
    const [stats, setStats] = useState<StatsType>()

    const updateStats = useCallback(() => {
        setStats({ ...world.stats })
    }, [world])

    useEffect(() => {
        world.addEventListener('endframe', updateStats)
    }, [world, updateStats])

    return (
        <section className="WorldStats">
            <h3>Stats</h3>
            {stats && (
                <div className="stats">
                    <span>fps:</span>
                    <span>{stats.fps}</span>

                    <span>frame(ms):</span>
                    <span>{stats.frameLength}</span>
                </div>
            )}
        </section>
    )
}
