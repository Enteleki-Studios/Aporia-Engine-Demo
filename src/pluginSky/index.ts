import { createComponent } from '@enteleki-studios/aporia-engine-core'
import { createQuery } from '@pluginEntities'

export * from './plugin'
export * from './skyPanel'

type SkyProps = {
    elevation: number
    azimuth: number
    turbidity: number
    rayleigh: number
    mieCoefficient: number
    mieDirectionalG: number
    cloudCoverage: number
    cloudDensity: number
    cloudElevation: number
    needsUpdate: boolean
}

export const SkySettings = createComponent(
    'SkySettings',
    (props?: Partial<SkyProps>): SkyProps => ({
        elevation: props?.elevation ?? 45,
        azimuth: props?.azimuth ?? 0,

        turbidity: props?.turbidity ?? 2.5,
        rayleigh: props?.rayleigh ?? 0.5,
        mieCoefficient: props?.mieCoefficient ?? 0.003,
        mieDirectionalG: props?.mieDirectionalG ?? 0.75,

        cloudCoverage: props?.cloudCoverage ?? 0.4,
        cloudDensity: props?.cloudDensity ?? 0.4,
        cloudElevation: props?.cloudElevation ?? 1,

        needsUpdate: true,
    }),
)

export type SkySettings = ReturnType<typeof SkySettings>

export const skyQuery = createQuery([SkySettings])
