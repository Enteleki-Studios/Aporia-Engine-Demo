import System from 'ECS/System'

export class Movement extends System {
    constructor() {
        super([
            'playerControl',
            'position',
            'animation',
            'singletonInput',
        ])

        this._controlledEntities = []
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

    tick() {
        let component
        let position
        this._controlledEntities.forEach((entity) => {
            const input = this._getComponent(entity, 'singletonInput')
            component = this._getComponent(entity, 'position');
            ({ position } = component)
            const mvAmt = 0.05
            if (input.upHold) {
                position[2] += mvAmt
                component._needsUpdate = true
            }

            if (input.downHold) {
                position[2] -= mvAmt
                component._needsUpdate = true
            }

            if (input.leftHold) {
                position[0] += mvAmt
                component._needsUpdate = true
            }

            if (input.rightHold) {
                position[0] -= mvAmt
                component._needsUpdate = true
            }
        })
    }
}
