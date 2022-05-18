import type { Component } from '../ECS/Component'

type Entity = Map<string, Component>
type ComponentTuple = Component[]
type QueryResult = ComponentTuple[]

// type AnyConstructor = abstract new (...args: any) => any
type ComponentConstructor = typeof Component
type InstanceTuple<T extends [...ComponentConstructor[]]> = {
    [K in keyof T]: T[K] extends ComponentConstructor ? InstanceType<T[K]> : T[K]
}

export class ComponentManager {
    components: Component[]
    entitiesById: Map<string, Entity>
    queryCache: Map<string, QueryResult>

    constructor() {
        this.components = []
        this.entitiesById = new Map()
        this.queryCache = new Map()
    }

    addComponent(component: Component) {
        const { entityId, type } = component

        if (this.entitiesById.has(entityId)) {
            const entityMap = this.entitiesById.get(entityId) as Entity
            if (entityMap.has(type)) {
                throw new Error(`Cannot add the same Component '${type}' to an Entity more than once`)
            } else {
                entityMap.set(type, component)
            }
        } else {
            this.entitiesById.set(entityId, new Map([[type, component]]))
        }

        this.components.push(component)
        this.queryCache = new Map()
    }

    addComponents(components: Component[]) {
        components.forEach((c) => { this.addComponent(c) })
    }

    getTuplesByQueryGeneric<R extends Component[]>(queryTypes: string[]) {
        const query = queryTypes.join('.')
        if (this.queryCache.has(query)) {
            return this.queryCache.get(query) as R[]
        }
        const tuples:Component[][] = []
        this.entitiesById.forEach((entity: Entity) => {
            if (queryTypes.every((qt) => entity.has(qt))) {
                tuples.push(queryTypes.map((qt) => entity.get(qt) as Component))
            }
        })
        this.queryCache.set(query, tuples)
        return tuples as R[]
    }

    getTuplesByClass<C extends [...ComponentConstructor[]]>(...componentClasses: C) {
        const queryTypes = componentClasses.map((c) => (c.name === 'PositionComponent' ? 'position' : c.name))
        const query = queryTypes.join('.')
        if (this.queryCache.has(query)) {
            return this.queryCache.get(query) as InstanceTuple<C>[]
        }
        const tuples:Component[][] = []
        this.entitiesById.forEach((entity: Entity) => {
            if (queryTypes.every((qt) => entity.has(qt))) {
                tuples.push(queryTypes.map((qt) => entity.get(qt) as Component))
            }
        })
        this.queryCache.set(query, tuples)
        return tuples as InstanceTuple<C>[]
    }

    getComponentsInspected() {
        const componentsSerialized:ReturnType<Component['serialize']>[] = []
        this.components.forEach((component) => {
            componentsSerialized.push(component.serialize())
        })
        return componentsSerialized
    }

    has(entityId: string, componentType: string) {
        return !!this.entitiesById.get(entityId)?.has(componentType)
    }

    get<C extends Component>(entityId: string, componentType: string) {
        return this.entitiesById.get(entityId)?.get(componentType) as C
    }
}
