import { Mesh, MeshBasicMaterial, PlaneGeometry, Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three'

import { BasicRenderer, PositionComponent, SpriteComponent } from 'gengine'

import { GROUND } from 'zombieHorde/components/componentTypes'

export class Renderer extends BasicRenderer {
    hasGround = false

    constructor(args: { canvas: HTMLCanvasElement }) {
        super(args)

        this.camera.position.set(0, 30, 0)
        this.camera.lookAt(new Vector3(0, 0, 0))
    }

    tick(delta: number) {
        super.tick(delta)

        this.ECS.ComponentManager.getTuplesByQuery(['POSITION', 'SPRITE']).forEach((tuple) => {
            const [positionComponent, spriteComponent] = tuple as [PositionComponent, SpriteComponent]
            if (!spriteComponent.isLoaded && !spriteComponent.isLoading) {
                const spriteTex = new TextureLoader().load(spriteComponent.url)
                spriteComponent.isLoading = true
                const spriteMat = new SpriteMaterial({ map: spriteTex })
                const sprite = new Sprite(spriteMat)
                spriteComponent.isLoaded = true
                spriteComponent.isLoading = false

                sprite.position.copy(positionComponent.position)
                this.scene.add(sprite)
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
