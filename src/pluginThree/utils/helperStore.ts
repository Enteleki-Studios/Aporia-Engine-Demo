import type { Object3D, Scene } from 'three'

import { ObjectStore } from '@core'

type Collection = {
    readonly type: string
    visible: boolean
    readonly helpers: Object3D[]
}

const createCollection = (type: string): Collection => ({
    type,
    visible: false,
    helpers: [],
})

type Callback = () => void

export class HelperStore {
    private store = new ObjectStore<string, Collection>(createCollection)
    private scene: Scene
    private observers = new Set<Callback>()
    private cachedCollections: Collection[] = []

    constructor(scene: Scene) {
        this.scene = scene
    }

    private onUpdate() {
        this.cachedCollections = this.store.values().toArray()
        this.observers.forEach((cb) => {
            cb()
        })
    }

    addHelper(type: string, helper: Object3D) {
        const [collection] = this.store.getOrCreate(type)
        helper.visible = collection.visible
        this.scene.add(helper)
        collection.helpers.push(helper)
        this.onUpdate()
    }

    toggleHelpers(type: string, visible?: boolean) {
        const [collection] = this.store.getOrCreate(type)

        const nextVisibility = visible ?? !collection.visible

        collection.helpers.forEach((helper) => {
            helper.visible = nextVisibility
        })

        collection.visible = nextVisibility
        this.onUpdate()
    }

    collections = () => {
        return this.cachedCollections
    }

    get(type: string) {
        return this.store.get(type)
    }

    subscribe = (cb: Callback) => {
        this.observers.add(cb)

        return () => {
            this.observers.delete(cb)
        }
    }
}
