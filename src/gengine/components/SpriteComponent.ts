import { Component } from '../ecs'

interface SpriteSettings {
    url: string
}

export class SpriteComponent extends Component {
    isLoaded = false
    isLoading = false
    url: string

    constructor({ url }: SpriteSettings) {
        super()

        this.url = url
    }
}
