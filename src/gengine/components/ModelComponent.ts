import type { Object3D } from 'three'
import { Component } from '../ECS/Component'

export class ModelComponent<ModelDB> extends Component {
    readonly modelName: keyof ModelDB
    isLoading = false
    resource: (null | Object3D) = null
    group: (null | Object3D) = null

    constructor(entityId: string, { modelName }: { modelName: keyof ModelDB }) {
        super(entityId)

        this.modelName = modelName
    }
}
