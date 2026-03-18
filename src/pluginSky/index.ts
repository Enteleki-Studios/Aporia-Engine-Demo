import { createComponent } from '@core'

import { createQuery } from '@pluginEntities'

export * from './plugin'
export * from './skyPanel'

type SkyProps = {
    elevation: number
    azimuth: number
    needsUpdate: boolean
}

export const SkySettings = createComponent(
    'SkySettings',
    (props?: Partial<SkyProps>): SkyProps => ({
        elevation: props?.elevation ?? 45,
        azimuth: props?.azimuth ?? 0,
        needsUpdate: true,
    }),
)

export type SkySettings = ReturnType<typeof SkySettings>

export const skyQuery = createQuery([SkySettings])
