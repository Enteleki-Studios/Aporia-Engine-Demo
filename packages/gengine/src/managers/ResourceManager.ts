export class ResourceManager {
    private resources: {
        [P in string]: Object3D
    }

    private loading: {
        [entityId in string]: boolean
    }

    constructor() {
        this.resources = {}
        this.loading = {}
    }

    isLoading(entityId: string) {
        return this.loading[entityId]
    }

    get(entityId: string) {
        return this.resources[entityId]
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
