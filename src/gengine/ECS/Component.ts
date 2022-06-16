// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentConstructor<T extends Component> = abstract new (...args: any[]) => T

export abstract class Component {
    readonly entityId: string

    constructor(entityId: string) {
        this.entityId = entityId
    }
}
