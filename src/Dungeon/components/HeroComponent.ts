import { Component } from 'ECS'
import { HERO } from './types'

export class HeroComponent extends Component {
    constructor(entityId: number) {
        super(HERO, entityId)
    }
}
