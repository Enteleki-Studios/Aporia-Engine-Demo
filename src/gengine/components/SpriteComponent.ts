import { Component } from '../ECS/Component'

interface SpriteSettings {
    url: string
}

export class SpriteComponent extends Component {
    isLoaded = false
    isLoading = false
    url: string

    constructor(entityId: string, { url }: SpriteSettings) {
        super(entityId)

        this.url = url
    }
}
