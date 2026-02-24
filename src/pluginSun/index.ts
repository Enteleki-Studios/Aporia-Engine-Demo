import { createComponent } from '@core'

import { createQuery } from '@pluginEntities'

export * from './plugin'

type SunProps = {
    inclination: number
    azimuth: number
    needsUpdate: boolean
}

export const SunComponent = createComponent(
    'Sun',
    (props?: Partial<SunProps>): SunProps => ({
        inclination: props?.inclination ?? 0.7,
        azimuth: props?.azimuth ?? 0.9,
        needsUpdate: true,
    }),
)

export type SunComponent = ReturnType<typeof SunComponent>

export const sunQuery = createQuery([SunComponent])
