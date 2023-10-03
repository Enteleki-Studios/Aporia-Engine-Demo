import type { Array3, Keymap } from 'definitions'
import { createComponent } from 'ecs'

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
    ({ offset, intensity }: { offset: Array3, intensity: number }) => ({
        offset,
        intensity,
        position: [0, 0, 0] as Array3,
        target: [0, 0, 0] as Array3,
    }),
)

export const directionComponent = createComponent('directionComponent', ({ direction }: { direction?: Array3 }) => ({
    direction: direction ?? ([0, 0, 1] as Array3),
}))

export const emitterComponent = createComponent('emitterComponent', ({ prefabId }: { prefabId: string }) => ({
    prefabId,
}))

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
        pan: { x: number, y: number },
        position: { centerRel: { x: number, y: number } },
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

export const modelComponent = createComponent(
    'modelComponent',
    ({ modelName, castShadow }: { modelName: string; castShadow?: boolean }) => ({
        modelName,
        castShadow: castShadow ?? false,
        isLoading: false as boolean,
        // resource: null as Object3D | null,
    }),
)

export const positionComponent = createComponent('positionComponent', ({ position }: { position?: Array3 }) => ({
    position: position ?? ([0, 0, 0] as Array3),
}))

export const spriteComponent = createComponent(
    'spriteComponent',
    ({ url }: { url: string }) => ({

        url,
        isLoaded: false,
        isLoading: false,
    }),
)

export const velocityComponent = createComponent('velocityComponent', ({ velocity }: { velocity?: Array3 }) => ({
    velocity: velocity ?? ([0, 0, 0] as Array3),
}))
