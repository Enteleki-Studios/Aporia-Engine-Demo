import type { Component } from '../ECS/Component'

type Entity = Map<string, Component>
type ComponentTuple = Component[]
type QueryResult = ComponentTuple[]

// eslint-disable-next-line
type ComponentConstructor = abstract new (...args: any) => any
// type ComponentConstructor = typeof Component
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
        const { entityId } = component
        const { name } = component.constructor

        if (this.entitiesById.has(entityId)) {
            const entityMap = this.entitiesById.get(entityId) as Entity
            if (entityMap.has(name)) {
                throw new Error(`Cannot add the same Component '${name}' to an Entity more than once`)
            } else {
                entityMap.set(name, component)
            }
        } else {
            this.entitiesById.set(entityId, new Map([[name, component]]))
        }

        this.components.push(component)
        this.queryCache = new Map()
    }

    addComponents(components: Component[]) {
        components.forEach((c) => { this.addComponent(c) })
    }

    getTuplesByClass<C extends [...ComponentConstructor[]]>(...componentClasses: C) {
        const queryTypes = componentClasses.map((c) => c.name)
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

    /* eslint-disable class-methods-use-this */
    getComponentsInspected() {
        // const componentsSerialized:ReturnType<Component['serialize']>[] = []
        // this.components.forEach((component) => {
        //     componentsSerialized.push(component.serialize())
        // })
        // return componentsSerialized
        return [{ entityId: 'temp' }]
    }

    has(entityId: string, componentType: string) {
        return !!this.entitiesById.get(entityId)?.has(componentType)
    }

    get<C extends Component>(entityId: string, componentType: string) {
        return this.entitiesById.get(entityId)?.get(componentType) as C
    }
}
