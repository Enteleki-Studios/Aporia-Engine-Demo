import React, { Fragment, useEffect } from 'react'

import { secondsToClockString } from './utils'

import { useForceUpdate } from 'reactjs/hooks/useForceUpdate'
import { World } from '../World'

type WorldStatsProps = {
    world: World
}

export const WorldStats = ({ world }: WorldStatsProps) => {
    const forceUpdate = useForceUpdate()

    useEffect(() => {
        world.addEventListener('endframe', forceUpdate)

        return () => {
            world.removeEventListener('endframe', forceUpdate)
        }
    }, [world, forceUpdate])

    const { stats } = world

    return (
        <section className="WorldStats">
            <h3>Stats</h3>
            <h4>Engine</h4>
            <div className="table">
                <span>fps:</span>
                <span>{stats.fpsAgg}</span>

                <span>frame time(ms):</span>
                <span>{stats.frameTime}</span>

                <span>frames:</span>
                <span>{stats.frames}</span>

                <span>runtime:</span>
                <span>{secondsToClockString(stats.totalRuntime, 3)}</span>
            </div>
            <h4>ECS</h4>
            <div className="table">
                <span>entities:</span>
                <span>{stats.ecs.entities}</span>

                <span>components:</span>
                <span>{stats.ecs.components}</span>

                <span>systems:</span>
                <span>{stats.ecs.systems}</span>

                <span>filters:</span>
                <span>{stats.ecs.filters}</span>
            </div>
            <h4>System runtimes</h4>
            <div className="table">
                {stats.ecs.systemsStats.map((sysStat) => (
                    <Fragment key={sysStat.name}>
                        <span>{`${sysStat.name}: `}</span>
                        <span>{sysStat.runtime}</span>
                    </Fragment>
                ))}
            </div>
        </section>
    )
}
