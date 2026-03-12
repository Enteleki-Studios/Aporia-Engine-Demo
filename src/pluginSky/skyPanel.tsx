import { type PluginsToResources } from '@core'

import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import { Panel, Range, Stack } from '@inspector'
import { type PluginEntities } from '@pluginEntities'
import { type PluginRuntime } from '@pluginRuntime'
import { sunQuery } from '@pluginSky'

import { type PluginSky } from './plugin'

export const useSkyWorld: TypedUseWorld<
    PluginsToResources<[PluginRuntime, PluginEntities, PluginSky]>
> = useWorld

export const SkyPanel = () => {
    useIntervalRender(500)

    const world = useSkyWorld()
    const sunResult = world.entities.queryFirst(sunQuery)

    const sun = sunResult?.[0][0]

    return (
        <Panel>
            <Stack>
                <h3>Sky</h3>
                <Range
                    defaultValue={sun?.elevation ?? 0}
                    min={0}
                    max={90}
                    onChange={(nextElevation) => {
                        world.runtime.addTask(() => {
                            if (sun) {
                                sun.elevation = nextElevation
                                sun.needsUpdate = true
                            }
                        })
                    }}
                >
                    Elevation
                </Range>
                <Range
                    defaultValue={sun?.azimuth ?? 0}
                    min={-180}
                    max={180}
                    onChange={(nextAzimuth) => {
                        world.runtime.addTask(() => {
                            if (sun) {
                                sun.azimuth = nextAzimuth
                                sun.needsUpdate = true
                            }
                        })
                    }}
                >
                    Azimuth
                </Range>
            </Stack>
        </Panel>
    )
}
