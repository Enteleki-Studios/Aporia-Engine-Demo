export { threejsPlugin } from './plugin'
export * from './utils'
// TODO move this back to core package after removing threejs dependency
export { StandardRenderer } from './StandardRenderer'

export { AxesHelper } from './objects/AxesHelper'
export { CustomGridTexture } from './objects/CustomGridTexture'
export { DebugInfoTexture } from './objects/DebugInfoTexture'
export { DefaultCube } from './objects/DefaultCube'
export { DefaultGrid } from './objects/DefaultGrid'
export { DirectionalLight } from './objects/DirectionalLight'
export { HUDLayer } from './objects/HUDLayer'
export { TextSprite } from './objects/TextSprite'
export { SkySphere } from './objects/SkySphere'

// Three re-exports
export { Capsule } from 'three/examples/jsm/math/Capsule'
export { Octree } from 'three/examples/jsm/math/Octree'
export { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper'

// Custom types
export type * from './threejs.d.ts'
