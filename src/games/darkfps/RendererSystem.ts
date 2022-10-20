import { AmbientLight, BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import {
    World,
    ECSFilter,
    AmbientLightComponent,
    CameraComponent,
    BasicGeometryComponent,
    RendererSystemBase,
    PositionComponent,
} from 'gengine'

import { Renderer } from './Renderer'

export class RendererSystem extends RendererSystemBase {
    renderer: Renderer

    ambientLightFilter = new ECSFilter([AmbientLightComponent])
    boxFilter = new ECSFilter([BasicGeometryComponent])
    cameraFilter = new ECSFilter([CameraComponent])

    filters = [
        this.ambientLightFilter,
        this.cameraFilter,
        this.boxFilter,
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

        this.boxFilter.entities.forEach((entity) => {
            if (!this.hasObject(entity.id, 'box')) {
                this.addObject(entity.id, 'box', new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()))

                if (entity.has(PositionComponent)) {
                    this.getObject(entity.id, 'box')?.position.copy(entity.get(PositionComponent).position)
                }
            }
        })
    }
}
