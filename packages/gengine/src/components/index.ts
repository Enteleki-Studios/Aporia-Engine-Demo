import { Vector3, type Object3D } from 'three'

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
        position: position ?? [0, 0, 0],
        lookAt: lookAt ?? [0, 0, 0],
    }),
)

// export class DirectionalLightComponent extends Component {
//     offset: [number, number, number]
//     intensity: number
//     position = new Vector3()
//     target = new Vector3()

//     constructor(offset: [number, number, number], intensity: number) {
//         super()
//         this.offset = offset
//         this.intensity = intensity
//     }
// }

export const directionComponent = createComponent(
    'directionComponent',
    ({ direction }: { direction?: Array3 }) => ({
        direction: direction ?? [0, 0, 1],
    }),
)

// export class EmitterComponent extends Component {
//     prefabId: string

//     constructor(id: string) {
//         super()

//         this.prefabId = id
//     }
// }

// export class HealthComponent extends Component {
//     health: number

//     constructor(health: number) {
//         super()
//         this.health = health
//     }
// }

// export class HitboxComponent extends Component {
//     radius

//     constructor(radius = 1) {
//         super()

//         this.radius = radius
//     }
// }

export const inputComponent = createComponent(
    'inputComponent',
    (keymap: Keymap) => {
        const mouse = {
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
    },
)

export const modelComponent = createComponent(
    'modelComponent',
    ({ modelName, castShadow }: { modelName: string; castShadow?: boolean }) => ({
        modelName,
        castShadow: castShadow ?? false,
        isLoading: false,
        // resource: null as Object3D | null,
    }),
)


export const positionComponent = createComponent(
    'positionComponent',
    ({ position }: { position?: Array3 }) => ({
        position: position ?? [0, 0, 0],
    }),
)

// export class SpriteComponent extends Component {
//     isLoaded = false
//     isLoading = false
//     url: string

//     constructor({ url }: { url: string }) {
//         super()

//         this.url = url
//     }
// }

export const velocityComponent = createComponent(
    'velocityComponent',
    ({ velocity }: { velocity?: Array3 }) => ({
        velocity: velocity ?? [0, 0, 0],
    }),
)
