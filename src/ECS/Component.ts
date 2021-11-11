export abstract class Component {
    readonly type: string

    readonly entity: number

    constructor(type: string, entity: number) {
        this.type = type
        this.entity = entity
    }
}
