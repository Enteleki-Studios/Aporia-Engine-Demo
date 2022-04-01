import type { Object3D } from 'three'
import { Component } from '../ECS/Component'
import { MODEL } from './componentTypes'

export class ModelComponent<modelDB> extends Component {
    type = MODEL
    readonly modelName: keyof modelDB
    isLoading = false
    resource: (null | Object3D) = null
    group: (null | Object3D) = null

    constructor(entityId: string, { modelName }: { modelName: keyof modelDB }) {
        super(entityId)

        this.modelName = modelName
    }
}
