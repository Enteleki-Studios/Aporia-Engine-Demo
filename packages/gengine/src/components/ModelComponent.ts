import type { Object3D } from 'three'
import { Component } from '../ecs'

export class ModelComponent<ModelDB> extends Component {
    readonly modelName: keyof ModelDB
    isLoading = false
    castShadow: boolean
    resource: null | Object3D = null

    constructor({ modelName, castShadow }: { modelName: keyof ModelDB, castShadow?: boolean }) {
        super()

        this.modelName = modelName
        this.castShadow = castShadow ?? false
    }
}
