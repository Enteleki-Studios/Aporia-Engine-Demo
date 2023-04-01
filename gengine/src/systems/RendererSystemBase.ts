import { Group, type Object3D } from 'three'

import { StandardRenderer } from '../three/StandardRenderer'
import { type ECSFilter, type Entity, System } from '../ecs'
import type { World } from '../World'

export class RendererSystemBase extends System {
    renderer: StandardRenderer

    private objectGroupsByEntity = new Map<Entity, Group>()

    filters: ECSFilter[] = []

    constructor(renderer: StandardRenderer) {
        super()

        this.renderer = renderer
    }

    private makeGroup(entity: Entity) {
        // TODO check for existing group?
        const newGroup = new Group()
        this.renderer.scene.add(newGroup)
        this.objectGroupsByEntity.set(entity, newGroup)

        return newGroup
    }

    getGroup(entity: Entity): Group {
        return this.objectGroupsByEntity.get(entity) || this.makeGroup(entity)
    }

    addObject(entity: Entity, objectName: string, object: Object3D) {
        const group = this.getGroup(entity)

        object.name = objectName

        if (group) {
            this.removeObject(entity, objectName)
            group.add(object)
        } else {
            this.makeGroup(entity).add(object)
        }
    }

    getObject(entity: Entity, objectName: string) {
        return this.objectGroupsByEntity.get(entity)?.getObjectByName(objectName)
    }

    hasObject(entity: Entity, objectName: string) {
        return !!this.getObject(entity, objectName)
    }

    removeObject(entity: Entity, objectName: string) {
        const group = this.getGroup(entity)

        if (group) {
            const object = this.getObject(entity, objectName)

            if (object) {
                group.remove(object)
            }
        }
    }

    applyToGroup = (f: (group: Group) => void) => (entity: Entity) => {
        const group = this.getGroup(entity)
        if (group) {
            f(group)
        }
    }

    applyToObject = (f: (object: Object3D, entity: Entity) => void) => (objectName: string) => (entity: Entity) => {
        const object = this.getObject(entity, objectName)
        if (object) {
            f(object, entity)
        }
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    tick(world: World) {
        // TODO pick up deleted entities
    }
}
