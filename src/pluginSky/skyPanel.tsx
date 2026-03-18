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
            <Stack direction="row" spacing={4}>
                <Stack>
                    <h3>Sun Position</h3>
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
                <Stack>
                    <h3>Atmosphere</h3>
                    <Range
                        defaultValue={sky.turbidity}
                        min={0}
                        max={20}
                        onChange={(next) => {
                            world.runtime.addTask(() => {
                                sky.turbidity = next
                                sky.needsUpdate = true
                            })
                        }}
                    >
                        Turbidity
                    </Range>
                    <Range
                        defaultValue={sky.rayleigh}
                        min={0}
                        max={4}
                        onChange={(next) => {
                            world.runtime.addTask(() => {
                                sky.rayleigh = next
                                sky.needsUpdate = true
                            })
                        }}
                    >
                        Rayleigh
                    </Range>
                    <Range
                        defaultValue={sky.mieCoefficient}
                        min={0}
                        max={0.1}
                        onChange={(next) => {
                            world.runtime.addTask(() => {
                                sky.mieCoefficient = next
                                sky.needsUpdate = true
                            })
                        }}
                    >
                        Mie Coefficient
                    </Range>
                    <Range
                        defaultValue={sky.mieDirectionalG}
                        min={0}
                        max={1}
                        onChange={(next) => {
                            world.runtime.addTask(() => {
                                sky.mieDirectionalG = next
                                sky.needsUpdate = true
                            })
                        }}
                    >
                        Mie Directional G
                    </Range>
                </Stack>
                <Stack>
                    <h3>Clouds</h3>
                    <Range
                        defaultValue={sky.cloudCoverage}
                        min={0}
                        max={1}
                        onChange={(next) => {
                            world.runtime.addTask(() => {
                                sky.cloudCoverage = next
                                sky.needsUpdate = true
                            })
                        }}
                    >
                        Coverage
                    </Range>
                    <Range
                        defaultValue={sky.cloudDensity}
                        min={0}
                        max={1}
                        onChange={(next) => {
                            world.runtime.addTask(() => {
                                sky.cloudDensity = next
                                sky.needsUpdate = true
                            })
                        }}
                    >
                        Density
                    </Range>
                    <Range
                        defaultValue={sky.cloudElevation}
                        min={0}
                        max={1}
                        onChange={(next) => {
                            world.runtime.addTask(() => {
                                sky.cloudElevation = next
                                sky.needsUpdate = true
                            })
                        }}
                    >
                        Elevation
                    </Range>
                </Stack>
            </Stack>
        </Panel>
    )
}
