import { createComponent } from '@core'

import { createQuery } from '@pluginEntities'

export * from './plugin'

type SunProps = {
    elevation: number
    azimuth: number
    needsUpdate: boolean
}

export const SunComponent = createComponent(
    'Sun',
    (props?: Partial<SunProps>): SunProps => ({
        elevation: props?.elevation ?? 45,
        azimuth: props?.azimuth ?? 0,
        needsUpdate: true,
    }),
)

export type SunComponent = ReturnType<typeof SunComponent>

export const sunQuery = createQuery([SunComponent])
