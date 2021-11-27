import type { Object3D } from 'three'
import { Component } from 'ECS'
import { MODEL } from './types'

export class Model extends Component {
    readonly modelId: number
    isLoading = false
    resource:(null | Object3D) = null

    constructor(entityId: number, { modelId }: { modelId: number }) {
        super(MODEL, entityId)

        this.modelId = modelId
    }
}
