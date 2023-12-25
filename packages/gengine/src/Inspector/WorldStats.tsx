import React, { Fragment, useEffect, useRef } from 'react'
import { PiArrowElbowDownRight, PiEngineDuotone, PiGraphDuotone, PiTimerDuotone } from 'react-icons/pi'

import { secondsToClockString } from './utils'

import { useForceUpdate } from 'reactjs/hooks/useForceUpdate'

import { Icon } from 'Inspector/Icon'
import { type World } from 'core'
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
            fpsGraph.current?.update(world.time.fps)
            frameGraph.current?.update(world.time.frameLength)
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

    const { stats, time } = world

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
                    {time.fps} <i ref={fpsGraphRef} />
                </span>

                <span>frame time:</span>
                <span>
                    {time.frameLength} <i ref={frameGraphRef} />
                </span>

                <span>frames:</span>
                <span>{time.frames}</span>

                <span>runtime:</span>
                <span>{secondsToClockString(time.elapsedTime, 3)}</span>
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

                <span>plugins:</span>
                <span>{stats.plugins}</span>

                <span>systems:</span>
                <span>{stats.systems}</span>

                <span>filters:</span>
                <span>{stats.ecs.filters}</span>
            </div>
            <h4>
                <Icon icon={<PiTimerDuotone />} />
                System runtimes
            </h4>
            <div className="table">
                {Object.values(stats.systemsStats).map((sysStat) => (
                    <Fragment key={sysStat.label}>
                        <span>{`${sysStat.label}: `}</span>
                        <span>{sysStat.runtime}</span>
                        {Object.entries(sysStat.extra).map(([k, v]) => (
                            <Fragment key={k}>
                                <span>
                                    <Icon icon={<PiArrowElbowDownRight />} />
                                    {`${k}: `}
                                </span>
                                <span>{v}</span>
                            </Fragment>
                        ))}
                    </Fragment>
                ))}
            </div>
        </section>
    )
}
