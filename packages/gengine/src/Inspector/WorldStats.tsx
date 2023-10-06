import React, { Fragment, useEffect, useRef } from 'react'
import { PiEngineDuotone, PiGraphDuotone, PiTimerDuotone } from 'react-icons/pi'

import { secondsToClockString } from './utils'

import { useForceUpdate } from 'reactjs/hooks/useForceUpdate'

import { Icon } from 'Inspector/Icon'
import { World } from '../World'
import { Graph } from 'utils/graph'

type WorldStatsProps = {
    world: World
}

export const WorldStats = ({ world }: WorldStatsProps) => {
    const forceUpdate = useForceUpdate()
    const fpsGraph = useRef<Graph>()
    const fpsGraphRef = useRef<HTMLElement>(null)
    const frameGraph = useRef<Graph>()
    const frameGraphRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const onEndFrame = () => {
            forceUpdate()
            fpsGraph.current?.update(world.stats.fps)
            frameGraph.current?.update(world.stats.frameTime)
        }

        world.addEventListener('endframe', onEndFrame)

        return () => {
            world.removeEventListener('endframe', onEndFrame)
        }
    }, [world, forceUpdate])

    useEffect(() => {
        fpsGraph.current = new Graph({ height: 25, max: 60 })
        frameGraph.current = new Graph({ height: 25, max: 16.5, foreground: '#FF8F00' })

        if (fpsGraphRef.current) {
            fpsGraphRef.current.appendChild(fpsGraph.current.domElement)
        }
        if (frameGraphRef.current) {
            frameGraphRef.current.appendChild(frameGraph.current.domElement)
        }
    }, [])

    const { stats } = world

    return (
        <section className="WorldStats">
            <h3>Stats</h3>
            <h4>
                <Icon icon={<PiEngineDuotone />} />
                Engine
            </h4>
            <div className="table">
                <span>fps:</span>
                <span>
                    {stats.fpsAgg} <i ref={fpsGraphRef} />
                </span>

                <span>frame time:</span>
                <span>
                    {stats.frameTimeAgg} <i ref={frameGraphRef} />
                </span>

                <span>frames:</span>
                <span>{stats.frames}</span>

                <span>runtime:</span>
                <span>{secondsToClockString(stats.totalRuntime, 3)}</span>
            </div>
            <h4>
                <Icon icon={<PiGraphDuotone />} />
                ECS
            </h4>
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
            <h4>
                <Icon icon={<PiTimerDuotone />} />
                System runtimes
            </h4>
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
