import { Engine, Graph as GraphIcon, Timer } from '@phosphor-icons/react'
import React, { Fragment, useEffect, useRef } from 'react'

import { Graph, type World, useForceUpdate, useSmoothNumber } from '@gengine/core'

import { Icon } from './Icon'
import { secondsToClockString } from './utils'

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

    const smoothFps = Math.floor(useSmoothNumber(time.fps))
    const smoothFrameLength = Math.ceil(useSmoothNumber(time.frameLength))

    return (
        <section className="WorldStats">
            <h3>Stats</h3>
            <h4>
                <Icon icon={<Engine weight="duotone" />} />
                Engine
            </h4>
            <div className="table">
                <span title="10 frame average">fps:</span>
                <span>
                    {smoothFps} <i ref={fpsGraphRef} />
                </span>

                <span title="10 frame average">frame time:</span>
                <span>
                    {smoothFrameLength} <i ref={frameGraphRef} />
                </span>

                <span>frames:</span>
                <span>{time.frames}</span>

                <span>runtime:</span>
                <span>{secondsToClockString(time.elapsedTime, 3)}</span>
            </div>
            <h4>
                <Icon icon={<GraphIcon weight="duotone" />} />
                Content
            </h4>
            <div className="table">
                <span>entities:</span>
                <span>{stats.ecs.entities}</span>

                <span>plugins:</span>
                <span>{stats.plugins}</span>

                <span>systems:</span>
                <span>{stats.systems}</span>

                <span>queries:</span>
                <span>{stats.ecs.queries}</span>
            </div>
            <h4>
                <Icon icon={<Timer weight="duotone" />} />
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
