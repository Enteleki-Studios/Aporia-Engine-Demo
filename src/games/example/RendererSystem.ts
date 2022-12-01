import { AmbientLight } from 'three'
import { World, ECSFilter, AmbientLightComponent, CameraComponent, Entity, RendererSystemBase } from 'gengine'

import { Renderer } from './Renderer'

export class RendererSystem extends RendererSystemBase {
    renderer: Renderer

    ambientLightFilter = new ECSFilter([AmbientLightComponent])
    cameraFilter = new ECSFilter([CameraComponent])

    filters = [
        this.ambientLightFilter,
        this.cameraFilter,
    ]

    constructor(renderer: Renderer) {
        super(renderer)

        this.renderer = renderer
    }

    receiveEntity(entity: Entity, filter: ECSFilter) {
        switch (filter) {
            case this.ambientLightFilter: {
                const { color, intensity } = entity.get(AmbientLightComponent)
                this.addObject(entity, 'ambient', new AmbientLight(color, intensity))
                break
            }
            default:
                break
        }
    }

    tick(world: World) {
        this.renderer.render(world.timeElapsedS)

        this.cameraFilter.entities.forEach((entity) => {
            const cameraComponent = entity.get(CameraComponent)
            this.renderer.camera.position.copy(cameraComponent.position)
            this.renderer.camera.lookAt(cameraComponent.lookAt)
        })
    }
}
