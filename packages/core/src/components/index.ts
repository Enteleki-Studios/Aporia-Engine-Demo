import { createComponent } from '~/core'
import type { Array3, Keymap } from '~/definitions'

export const tags = {
    hero: 'hero',
    ai: 'ai',
    cameraTarget: 'cameraTarget',
    sunTarget: 'sunTarget',
} as const

export { pointLightComponent } from './PointLightComponent'
export { basicGeometryComponent } from './BasicGeometryComponent'
export { colliderComponent, type Collider } from './ColliderComponent'
export { damagingComponent } from './DamagingComponent'

export * from './physics'

export const ambientLightComponent = createComponent(
    'ambientLightComponent',
    ({ color, intensity }: { color: number; intensity: number }) => ({
        color,
        intensity,
    }),
)

export const cameraComponent = createComponent(
    'cameraComponent',
    ({ position, lookAt }: { position?: Array3; lookAt?: Array3 }) => ({
        position: position ?? ([0, 0, 0] as Array3),
        lookAt: lookAt ?? ([0, 0, 0] as Array3),
    }),
)

export const directionalLightComponent = createComponent(
    'directionalLightComponent',
    ({ offset, intensity }: { offset: Array3; intensity: number }) => ({
        offset,
        intensity,
        position: [0, 0, 0] as Array3,
        target: [0, 0, 0] as Array3,
    }),
)

export const directionComponent = createComponent('directionComponent', ({ direction }: { direction?: Array3 }) => ({
    direction: direction ?? ([0, 0, 1] as Array3),
}))

export const emitterComponent = createComponent(
    'emitterComponent',
    ({ prefabId, delay }: { prefabId: string; delay: number }) => ({
        prefabId,
        // TODO move to timer component
        delay,
        elapsed: 0 as number,
    }),
)

export const healthComponent = createComponent('healthComponent', ({ health }: { health: number }) => ({
    health,
}))

export const hitboxComponent = createComponent(
    'hitboxComponent',

    ({ radius = 1 }: { radius?: number }) => ({
        radius,
    }),
)

export const inputComponent = createComponent('inputComponent', ({ keymap }: { keymap: Keymap }) => {
    const mouse: {
        pan: { x: number; y: number }
        position: { centerRel: { x: number; y: number } }
    } = {
        pan: {
            x: 0,
            y: 0,
        },
        position: {
            centerRel: {
                x: 0,
                y: 0,
            },
        },
    }

    const input: Record<string, { press: boolean; hold: boolean }> = {}

    Object.keys(keymap).forEach((action) => {
        input[action] = {
            press: false,
            hold: false,
        }
    })

    return {
        mouse,
        input,
    }
})

type Model = {
    modelPath: string
    texturePath?: string
    scale: number
    animations?: Record<string, string>
    translate?: [number, number, number]
    radius?: number
}
export const modelComponent = createComponent(
    'modelComponent',
    ({ modelName, castShadow, data }: { modelName: string; castShadow?: boolean; data: Model }) => ({
        modelName,
        castShadow: castShadow ?? false,
        data,
    }),
)

export const animationComponent = createComponent('animationComponent', ({ state }: { state?: string }) => ({
    state: state ?? null,
    prevState: null as string | null,
}))

export const transform3D = createComponent(
    'transform3D',
    ({ position, rotation, scale }: { position?: Array3; rotation?: Array3; scale?: Array3 }) => ({
        position: position ?? ([0, 0, 0] as Array3),
        rotation: rotation ?? ([0, 0, 0] as Array3),
        scale: scale ?? ([1, 1, 1] as Array3),
    }),
)

export const spriteComponent = createComponent('spriteComponent', ({ url }: { url: string }) => ({
    url,
    isLoaded: false,
    isLoading: false,
}))

export const velocityComponent = createComponent('velocityComponent', ({ velocity }: { velocity?: Array3 }) => ({
    velocity: velocity ? ([...velocity] as Array3) : ([0, 0, 0] as Array3),
}))

type Geometry2DPlane = {
    shape: 'plane'
    width: number
    height: number
}

type Geometry2DCircle = {
    shape: 'circle'
    radius: number
}

export const mesh2D = createComponent('geometry2D', (props: Geometry2DPlane | Geometry2DCircle) => ({ ...props }))

type MaterialBasic = {
    material: 'basic'
    color: string
}

type MaterialStandard = {
    material: 'standard'
    color?: string
    mapUrl?: string
    wrapS?: boolean
    wrapT?: boolean
    repeatX?: number
    repeatY?: number
}

export const material = createComponent('material', (props: MaterialBasic | MaterialStandard) => ({ ...props }))
