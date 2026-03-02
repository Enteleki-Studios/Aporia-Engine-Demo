import { PluginsToResources } from '@core'

import { TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import { Panel, Stack } from '@inspector'
import { PluginEntities } from '@pluginEntities'
import { sunQuery } from '@pluginSky'

import { PluginSky } from './plugin'

export const useSkyWorld: TypedUseWorld<PluginsToResources<[PluginEntities, PluginSky]>> =
    useWorld

export const SkyPanel = () => {
    useIntervalRender(500)

    const world = useSkyWorld()
    const sunResult = world.entities.queryFirst(sunQuery)

    const sun = sunResult?.[0][0]

    return (
        <Panel>
            <Stack>
                <h3>Sky</h3>
                <span>Elevation: {sun?.elevation}</span>
                <span>Azimuth: {sun?.azimuth}</span>
            </Stack>
        </Panel>
    )
}
