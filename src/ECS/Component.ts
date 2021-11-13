export abstract class Component {
    readonly type: string
    readonly entityId: number

    constructor(type: string, entityId: number) {
        this.type = type
        this.entityId = entityId
    }
}
