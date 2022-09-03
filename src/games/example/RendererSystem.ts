import { AmbientLight } from 'three'
import { System, World, ECSFilter, AmbientLightComponent, CameraComponent } from 'gengine'

import { Renderer } from './Renderer'

export class RendererSystem extends System {
    renderer: Renderer

    ambientLightFilter = new ECSFilter([AmbientLightComponent])
    cameraFilter = new ECSFilter([CameraComponent])

    filters = [
        this.ambientLightFilter,
        this.cameraFilter,
    ]

    constructor(renderer: Renderer) {
        super()

        this.renderer = renderer
    }

    tick(world: World) {
        this.renderer.render(world.timeElapsedS)

        this.ambientLightFilter.entities.forEach((entity) => {
            const ambientLightComponent = entity.get(AmbientLightComponent)
            if (!ambientLightComponent.resource) {
                const { color, intensity } = ambientLightComponent
                ambientLightComponent.resource = new AmbientLight(color, intensity)
                this.renderer.scene.add(ambientLightComponent.resource)
            }
        })

        this.cameraFilter.entities.forEach((entity) => {
            const cameraComponent = entity.get(CameraComponent)
            this.renderer.camera.position.copy(cameraComponent.position)
            this.renderer.camera.lookAt(cameraComponent.lookAt)
        })
    }
}
