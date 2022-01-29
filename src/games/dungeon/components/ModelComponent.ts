import type { Object3D } from 'three'
import { Component } from 'gengine'
import { MODEL } from './types'

export class ModelComponent extends Component {
    type = MODEL
    readonly modelId: number
    isLoading = false
    resource: (null | Object3D) = null
    group: (null | Object3D) = null

    constructor(entityId: string, { modelId }: { modelId: number }) {
        super(entityId)

        this.modelId = modelId
    }
}
