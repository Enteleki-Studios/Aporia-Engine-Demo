import { createComponent } from '~/core'

type PointLightSettings = {
    color: number
    intensity: number
    distance?: number
    decay?: number
    offset?: [number, number, number]
    castShadow?: boolean
}

export const pointLightComponent = createComponent(
    'pointLightComponent',
    ({
        color,
        intensity,
        distance = 0,
        decay = 2,
        offset = [0, 0, 0],
        castShadow = false,
    }: PointLightSettings) => ({
        color: color,
        intensity: intensity,
        distance: distance,
        decay: decay,
        offset: offset,
        castShadow: castShadow,
    }),
)
