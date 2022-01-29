export abstract class Component {
    readonly abstract type: string
    readonly entityId: string

    constructor(entityId: string) {
        this.entityId = entityId
    }

    // Return save data
    serialize() {
        return {
            entityId: this.entityId,
            type: this.type,
        }
    }

    // Return select properties for the Inspector
    inspect() {
        return {
            entityId: this.entityId,
            type: this.type,
        }
    }
}
