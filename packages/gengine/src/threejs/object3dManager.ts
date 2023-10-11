import { Group, Object3D } from 'three'
import { ResourceManager } from 'managers/ResourceManager'
import { StandardRenderer } from './StandardRenderer'

export const makeObject3dManager = (renderer: StandardRenderer) =>
    new ResourceManager<Group, Object3D>({
        init: () => {
            const group = new Group()
            renderer.scene.add(group)
            return group
        },
        name: (obj, name) => (obj.name = name),
        add: (group, obj) => group.add(obj),
        get: (group, name) => group.getObjectByName(name),
        remove: (group, obj) => group.remove(obj),
    })

// Test
// threeObject3DManager.addResource('myEntity', 'mesh', new Mesh())
// console.debug(threeObject3DManager.getResource('myEntity', 'mesh'))
