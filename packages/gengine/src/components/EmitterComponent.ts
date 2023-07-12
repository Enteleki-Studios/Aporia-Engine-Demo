import { Component } from '../ecs'

export class EmitterComponent extends Component {
    prefabId: string

    constructor(id: string) {
        super()

        this.prefabId = id
    }
}
