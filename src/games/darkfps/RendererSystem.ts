import { AmbientLight } from 'three'
import { World, ECSFilter, AmbientLightComponent, CameraComponent, RendererSystemBase } from 'gengine'

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

    tick(world: World) {
        this.renderer.render(world.timeElapsedS)

        this.ambientLightFilter.entities.forEach((entity) => {
            if (!this.hasObject(entity.id, 'ambient')) {
                const { color, intensity } = entity.get(AmbientLightComponent)
                this.addObject(entity.id, 'ambient', new AmbientLight(color, intensity))
            }
        })

        this.cameraFilter.entities.forEach((entity) => {
            const cameraComponent = entity.get(CameraComponent)
            this.renderer.camera.position.copy(cameraComponent.position)
            this.renderer.camera.lookAt(cameraComponent.lookAt)
        })
    }
}
