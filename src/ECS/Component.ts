export abstract class Component {
    readonly abstract type: string
    readonly entityId: number

    constructor(entityId: number) {
        this.entityId = entityId
    }
}
