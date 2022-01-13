export abstract class Component {
    readonly abstract type: string
    readonly entityId: string

    constructor(entityId: string) {
        this.entityId = entityId
    }

    serialize() {
        return {
            entityId: this.entityId,
            type: this.type,
        }
    }
}
