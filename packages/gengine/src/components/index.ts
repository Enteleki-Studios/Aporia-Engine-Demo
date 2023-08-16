import type { Array3, Keymap } from 'definitions'
import { Vector3, type Object3D } from 'three'
import { Component } from '../ecs'

export class AIComponent extends Component {}

export class AmbientLightComponent extends Component {
    color: number
    intensity: number

    constructor({ color, intensity }: { color: number, intensity: number }) {
        super()

        this.color = color
        this.intensity = intensity
    }
}

export { BasicGeometryComponent } from './BasicGeometryComponent'

export class CameraComponent extends Component {
    position: Array3
    lookAt: Array3

    constructor({ position, lookAt }: { position?: Array3, lookAt?: Array3 } = {}) {
        super()

        this.position = position ?? [0, 0, 0]
        this.lookAt = lookAt ?? [0, 0, 0]
    }
}

export class CameraTargetComponent extends Component {}

export { ColliderComponent, type Collider } from './ColliderComponent'
export { DamagingComponent } from './DamagingComponent'

export class DirectionalLightComponent extends Component {
    offset: [number, number, number]
    intensity: number
    position = new Vector3()
    target = new Vector3()

    constructor(offset: [number, number, number], intensity: number) {
        super()
        this.offset = offset
        this.intensity = intensity
    }
}
export { DirectionComponent } from './DirectionComponent'

export class EmitterComponent extends Component {
    prefabId: string

    constructor(id: string) {
        super()

        this.prefabId = id
    }
}

export class HealthComponent extends Component {
    health: number

    constructor(health: number) {
        super()
        this.health = health
    }
}
export class HeroComponent extends Component {}

export class HitboxComponent extends Component {
    radius

    constructor(radius = 1) {
        super()

        this.radius = radius
    }
}

export class InputComponent extends Component {
    input: Record<string, { press: boolean; hold: boolean }> = {}
    mouse: {
        pan: {
            x: number
            y: number
        }
        position: {
            centerRel: {
                x: number
                y: number
            }
        }
    }

    constructor(keymap: Keymap) {
        super()

        this.mouse = {
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

        Object.keys(keymap).forEach((action) => {
            this.input[action] = {
                press: false,
                hold: false,
            }
        })
    }
}

export class ModelComponent<ModelDB> extends Component {
    readonly modelName: keyof ModelDB
    isLoading = false
    castShadow: boolean
    resource: null | Object3D = null

    constructor({ modelName, castShadow }: { modelName: keyof ModelDB; castShadow?: boolean }) {
        super()

        this.modelName = modelName
        this.castShadow = castShadow ?? false
    }
}
export { PointLightComponent } from './PointLightComponent'

export class PositionComponent extends Component {
    position: Array3

    constructor({ position }: { position?: Array3 } = {}) {
        super()

        this.position = position ?? [0, 0, 0]
    }
}

export class SpriteComponent extends Component {
    isLoaded = false
    isLoading = false
    url: string

    constructor({ url }: { url: string }) {
        super()

        this.url = url
    }
}

export class SunTargetComponent extends Component {}

export class VelocityComponent extends Component {
    velocity: Array3

    constructor({ velocity }: { velocity?: Array3 } = {}) {
        super()

        this.velocity = velocity ?? [0, 0, 0]
    }
}
