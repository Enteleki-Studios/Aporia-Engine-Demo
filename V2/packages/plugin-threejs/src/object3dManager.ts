import { StandardRenderer } from './StandardRenderer'
import { AnimationAction, AnimationClip, AnimationMixer, Group, Object3D } from 'three'

import { ResourceManager } from '@gengine/core'

export const makeObject3dManager = (renderer: StandardRenderer) =>
    new ResourceManager<Group, Object3D>({
        init: () => {
            const group = new Group()
            renderer.scene.add(group)
            return group
        },
        add: (group, name, obj) => {
            obj.name = name
            group.add(obj)
        },
        get: (group, name) => group.getObjectByName(name),
        remove: (group, _, obj) => group.remove(obj),
    })

type AnimationWrapper = {
    name: string
    clip: AnimationClip
    action: AnimationAction
}

type AnimationsContainer = {
    mixer?: AnimationMixer
    animations: Record<string, AnimationWrapper>
}

export const makeAnimationManager = () =>
    new ResourceManager<AnimationsContainer, AnimationWrapper>({
        init: (mixer: AnimationMixer) => ({ mixer, animations: {} }),
        add: (container, name, wrapper) => {
            container.animations[name] = wrapper
        },
        get: (container, name) => container.animations[name],
        remove: (container, name) => delete container.animations[name],
    })

// Test
// threeObject3DManager.addResource('myEntity', 'mesh', new Mesh())
// console.debug(threeObject3DManager.getResource('myEntity', 'mesh'))
