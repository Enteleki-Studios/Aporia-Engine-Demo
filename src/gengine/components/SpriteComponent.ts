import { Component } from '../ECS/Component'

interface SpriteSettings {
    url: string
}

export class SpriteComponent extends Component {
    type = 'sprite'
    isLoaded = false
    isLoading = false
    url: string

    constructor(entityId: string, { url }: SpriteSettings) {
        super(entityId)

        this.url = url
    }

    inspect() {
        return {
            ...super.inspect(),
            url: this.url,
            isLoaded: this.isLoaded.toString(),
            isLoading: this.isLoading.toString(),
        }
    }
}
