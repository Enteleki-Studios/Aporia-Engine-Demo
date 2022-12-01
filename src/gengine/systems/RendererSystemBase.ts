import { Group, Object3D } from 'three'

import { StandardRenderer } from '../three/StandardRenderer'
import { ECSFilter, Entity, System } from '../ECS'
import { World } from '../World'

export class RendererSystemBase extends System {
    renderer: StandardRenderer

    private objectGroupsByEntity = new Map<Entity, Group>()

    filters: ECSFilter[] = []

    constructor(renderer: StandardRenderer) {
        super()

        this.renderer = renderer
    }

    getGroup(entity: Entity) {
        return this.objectGroupsByEntity.get(entity)
    }

    addObject(entity: Entity, objectName: string, object: Object3D) {
        const group = this.getGroup(entity)

        object.name = objectName

        if (group) {
            group.add(object)
        } else {
            const newGroup = new Group()
            newGroup.add(object)
            this.renderer.scene.add(newGroup)
            this.objectGroupsByEntity.set(entity, newGroup)
        }
    }

    getObject(entity: Entity, objectName: string) {
        return this.objectGroupsByEntity.get(entity)?.getObjectByName(objectName)
    }

    hasObject(entity: Entity, objectName: string) {
        return !!this.getObject(entity, objectName)
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    tick(world: World) {
        // TODO pick up deleted entities
    }
}
