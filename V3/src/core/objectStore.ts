// TODO: Should this extend a WeakMap?
export class ObjectStore<K, V> extends Map<K, V> {
    private initNew: (key: K) => V

    constructor(initializer: (key: K) => V) {
        super()
        this.initNew = initializer
    }

    create(key: K) {
        const newEntry = this.initNew(key)

        this.set(key, newEntry)

        return newEntry
    }

    getOrCreate(key: K): [V, boolean] {
        const existingEntry = this.get(key)

        if (existingEntry) {
            return [existingEntry, false]
        }

        return [this.create(key), true]
    }
}
