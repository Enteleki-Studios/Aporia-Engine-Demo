type ContainerInterface<C, R> = {
    init: () => C
    name: (resource: R, name: string) => void
    add: (container: C, resource: R) => void
    get: (container: C, name: string) => R | undefined
    remove: (container: C, resource: R) => void
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

        this.containerInterface.name(resource, name)
        this.containerInterface.add(container, resource)

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
            this.containerInterface.remove(container, resource)
            return true
        }

        return false
    }

    newContainer(key: Key) {
        const newContainer = this.containerInterface.init()

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
}

// import { Group, Mesh, Object3D } from "three"
// const threeObject3DManager = new ResourceManager<Group, Object3D>({
//     init: () => new Group(),
//     name: (obj, name) => obj.name = name,
//     add: (group, obj) => group.add(obj),
//     get: (group, name) => group.getObjectByName(name),
//     remove: (group, obj) => group.remove(obj)
// })

// Test
// threeObject3DManager.addResource('myEntity', 'mesh', new Mesh())
// console.debug(threeObject3DManager.getResource('myEntity', 'mesh'))

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
