import {
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Vector3,
} from 'three'

import { BasicRenderer, PositionComponent, SpriteComponent, ResourceManager } from 'gengine'

import { GROUND } from 'zombieHorde/components/componentTypes'

export class Renderer extends BasicRenderer {
    hasGround = false

    constructor(args: { canvas: HTMLCanvasElement }) {
        super(args)

        // this.camera = new OrthographicCamera(-15, 15, -15, 15, 0.5, 500)
        this.camera.position.set(0, 30, 0)
        this.camera.lookAt(new Vector3(0, 0, 0))
    }

    tick(delta: number) {
        super.tick(delta)

        this.ECS.ComponentManager.getTuplesByQuery(['POSITION', 'SPRITE']).forEach((tuple) => {
            const [positionComponent, spriteComponent] = tuple as [PositionComponent, SpriteComponent]
            const { entityId } = spriteComponent
            if (!ResourceManager.get(entityId) && !ResourceManager.isLoading(entityId)) {
                this.scene.add(ResourceManager.loadSprite(spriteComponent))
            } else {
                ResourceManager.get(entityId).position.copy(positionComponent.position)
            }
        })

        if (!this.hasGround) {
            this.ECS.ComponentManager.getTuplesByQuery([GROUND]).forEach(() => {
                const groundGeo = new PlaneGeometry(32, 32)
                const groundMat = new MeshBasicMaterial({
                    color: 0x432911,
                })
                const groundPlane = new Mesh(groundGeo, groundMat)
                groundPlane.rotation.x = -Math.PI / 2
                this.scene.add(groundPlane)

                this.hasGround = true
            })
        }
    }
}
