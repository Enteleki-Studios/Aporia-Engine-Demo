import { type PluginsToResources } from '@core'

import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import { Alert, Panel, Range, Stack } from '@inspector'
import { type PluginEntities } from '@pluginEntities'
import { type PluginRuntime } from '@pluginRuntime'
import { skyQuery } from '@pluginSky'

import { type PluginSky } from './plugin'

export const useSkyWorld: TypedUseWorld<
    PluginsToResources<[PluginRuntime, PluginEntities, PluginSky]>
> = useWorld

export const SkyPanel = () => {
    useIntervalRender(500)

    const world = useSkyWorld()
    const skyResult = world.entities.queryFirst(skyQuery)

    const sky = skyResult?.[0][0]

    if (!sky) {
        return (
            <Panel>
                <Stack>
                    <h3>Sky</h3>
                    <Alert>
                        Add the SkySettings component to your world to enable this panel
                    </Alert>
                </Stack>
            </Panel>
        )
    }

    return (
        <Panel>
            <Stack>
                <h3>Sky</h3>
                <Range
                    defaultValue={sky.elevation}
                    min={0}
                    max={90}
                    onChange={(nextElevation) => {
                        world.runtime.addTask(() => {
                            sky.elevation = nextElevation
                            sky.needsUpdate = true
                        })
                    }}
                >
                    Elevation
                </Range>
                <Range
                    defaultValue={sky.azimuth}
                    min={-180}
                    max={180}
                    onChange={(nextAzimuth) => {
                        world.runtime.addTask(() => {
                            sky.azimuth = nextAzimuth
                            sky.needsUpdate = true
                        })
                    }}
                >
                    Azimuth
                </Range>
            </Stack>
        </Panel>
    )
}
