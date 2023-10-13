type ContainerInterface<C, R> = {
    init: (args?: any) => C
    add: (container: C, name: string, resource: R) => void
    get: (container: C, name: string) => R | undefined
    remove: (container: C, name: string, resource: R) => void
}

export class ResourceManager<Container, Resource, Key = string> {
    private containers = new Map<Key, Container>()
    private containerInterface: ContainerInterface<Container, Resource>

    constructor(containerInterface: ContainerInterface<Container, Resource>) {
        this.containerInterface = containerInterface
    }

    addResource(key: Key, name: string, resource: Resource) {
        const container = this.getContainer(key) ?? this.newContainer(key)

        // Remove if the resource already exists
        this.removeResource(key, name)

        this.containerInterface.add(container, name, resource)

        return this
    }

    getResource(key: Key, name: string) {
        const container = this.getContainer(key)

        if (container) {
            return this.containerInterface.get(container, name)
        }
    }

    removeResource(key: Key, name: string) {
        const container = this.getContainer(key)
        const resource = this.getResource(key, name)

        if (container && resource) {
            this.containerInterface.remove(container, name, resource)
            return true
        }

        return false
    }

    hasResource(key: Key, name: string) {
        return !!this.getResource(key, name)
    }

    newContainer(key: Key, ...args: any) {
        const newContainer = this.containerInterface.init(...args)

        this.containers.set(key, newContainer)

        return newContainer
    }

    getContainer(key: Key) {
        return this.containers.get(key)
    }

    removeContainer(key: Key) {
        const container = this.getContainer(key)

        if (container) {
            this.containers.delete(key)
            return container
        }

        return false
    }

    hasContainer(key: Key) {
        return this.containers.has(key)
    }
}

// loadSprite(entityId: string, sprite: ReturnType<typeof spriteComponent>) {
//     const { url } = sprite
//     this.loading[entityId] = true

//     const spriteTex = new TextureLoader().load(url, () => {
//         this.loading[entityId] = false
//     })
//     const spriteMat = new SpriteMaterial({ map: spriteTex })
//     const spriteObj = new Sprite(spriteMat)

//     this.resources[entityId] = spriteObj

//     return sprite
// }
