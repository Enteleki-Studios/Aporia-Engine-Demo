import React, { Fragment, useEffect, useRef } from 'react'
import { Engine, Graph as GraphIcon, Timer } from '@phosphor-icons/react'

import { secondsToClockString } from './utils'

import { Icon } from './Icon'
import { type World, Graph, useForceUpdate } from '@gengine/core'

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

        return () => {
            fpsGraphRef.current?.replaceChildren()
            frameGraphRef.current?.replaceChildren()
        }
    }, [])

    const { stats, time } = world

    return (
        <section className="WorldStats">
            <h3>Stats</h3>
            <h4>
                <Icon icon={<Engine />} />
                Engine
            </h4>
            <div className="table">
                <span>fps:</span>
                <span>
                    {time.fps} <i ref={fpsGraphRef} />
                </span>

                <span>frame time:</span>
                <span>
                    {Math.ceil(time.frameLength)} <i ref={frameGraphRef} />
                </span>

                <span>frames:</span>
                <span>{time.frames}</span>

                <span>runtime:</span>
                <span>{secondsToClockString(time.elapsedTime, 3)}</span>
            </div>
            <h4>
                <Icon icon={<GraphIcon />} />
                Content
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
                <Icon icon={<Timer />} />
                System runtimes
            </h4>
            <div className="table">
                {world.systems.map((wrapper) => {
                    const sysStat = world.stats.systemsStats[wrapper.key]
                    return (
                        <Fragment key={sysStat.label}>
                            <span>{`${sysStat.label}: `}</span>
                            <span>{sysStat.runtime}</span>
                            {Object.entries(sysStat.extra).map(([k, v]) => (
                                <Fragment key={k}>
                                    <span className="subline">{`${k}: `}</span>
                                    <span>{v}</span>
                                </Fragment>
                            ))}
                        </Fragment>
                    )
                })}
            </div>
        </section>
    )
}
