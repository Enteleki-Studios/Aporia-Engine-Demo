import { TextureLoader, SpriteMaterial, Sprite, Object3D } from 'three'

import type { SpriteComponent } from '../components/SpriteComponent'

class RM {
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

    loadSprite(entityId: string, spriteComponent: SpriteComponent) {
        const { url } = spriteComponent
        this.loading[entityId] = true

        const spriteTex = new TextureLoader().load(url, () => {
            this.loading[entityId] = false
        })
        const spriteMat = new SpriteMaterial({ map: spriteTex })
        const sprite = new Sprite(spriteMat)

        this.resources[entityId] = sprite

        return sprite
    }
}

export const ResourceManager = new RM()
