import type { Object3D } from 'three'
import { Component } from 'ECS'
import { MODEL } from './types'

export class ModelComponent extends Component {
    type = MODEL
    readonly modelId: number
    isLoading = false
    resource:(null | Object3D) = null

    constructor(entityId: number, { modelId }: { modelId: number }) {
        super(entityId)

        this.modelId = modelId
    }
}
