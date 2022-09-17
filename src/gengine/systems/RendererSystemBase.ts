import { Group, Object3D } from 'three'

import { StandardRenderer } from '../three/StandardRenderer'
import { ECSFilter, EntityId, System } from '../ECS'
import { World } from '../World'

export class RendererSystemBase extends System {
    renderer: StandardRenderer

    private objectGroupsByEntityId = new Map<EntityId, Group>()

    filters: ECSFilter[] = []

    constructor(renderer: StandardRenderer) {
        super()

        this.renderer = renderer
    }

    addObject(entityId: EntityId, objectName: string, object: Object3D) {
        const group = this.objectGroupsByEntityId.get(entityId)

        object.name = objectName

        if (group) {
            group.add(object)
        } else {
            const newGroup = new Group()
            newGroup.add(object)
            this.renderer.scene.add(newGroup)
            this.objectGroupsByEntityId.set(entityId, newGroup)
        }
    }

    getObject(entityId: EntityId, objectName: string) {
        return this.objectGroupsByEntityId.get(entityId)?.getObjectByName(objectName)
    }

    hasObject(entityId: EntityId, objectName: string) {
        return !!this.getObject(entityId, objectName)
    }

    tick(world: World) {
        // TODO pick up deleted entities
    }
}
