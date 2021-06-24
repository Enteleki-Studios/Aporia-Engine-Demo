import System from 'ECS/System'

export class Movement extends System {
    constructor(ECS) {
        super([
            'playerControl',
            'position',
            'animation',
        ], ECS)

        this._controlledEntities = []

        this._initInputHandlers()
    }

    addComponent(component) {
        switch (component.type) {
            case 'playerControl':
                this._controlledEntities.push(component.entity)
                break
            default:
                break
        }
        this._saveComponent(component)
    }

    _initInputHandlers() {
        document.addEventListener('keydown', this._onKeyDown.bind(this))
    }

    _onKeyDown(e) {
        this._controlledEntities.forEach((entity) => {
            const { position } = this._getComponent(entity, 'position')
            const mvAmt = 0.5
            switch (e.code) {
                case 'KeyW':
                    position[2] += mvAmt
                    break
                case 'KeyS':
                    position[2] -= mvAmt
                    break
                case 'KeyA':
                    position[0] += mvAmt
                    break
                case 'KeyD':
                    position[0] -= mvAmt
                    break
                default:
                    break
            }
            this._ECS.broadcastEvent({
                name: 'position.updated',
                entity,
                position,
            })
        })
    }
}
