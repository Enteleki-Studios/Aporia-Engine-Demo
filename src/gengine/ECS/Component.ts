export abstract class Component {
    readonly entityId: string

    constructor(entityId: string) {
        this.entityId = entityId
    }
}
