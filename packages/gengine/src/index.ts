// World
export { World, type StatsType } from './World'

// ECS
export * from './ecs'

// Components
export * from './components'

// Filters
export * from './filters'

// Systems
export { applyVelocitySystem } from './systems/applyVelocitySystem'
export { DamageSystem } from './systems/DamageSystem'
export { EmitterSystem } from './systems/EmitterSystem'
export { firstPersonCameraSystem } from './systems/FirstPersonCameraSystem'
export { firstPersonMovementSystem, firstPersonMovementFilter } from './systems/FirstPersonMovementSystem'
export { inputSystem } from './systems/InputSystem'
export { TwinStickMovementSystem } from './systems/TwinStickMovementSystem'
export { ThirdPersonCameraSystem } from './systems/ThirdPersonCameraSystem'
export { RendererSystemBase } from './systems/RendererSystemBase'
export { SunSystem } from './systems/SunSystem'

// Managers
export { InputManager } from './managers/InputManager'
export { ResourceManager } from './managers/ResourceManager'

// Inspector
export * as inspector from './Inspector'

// React
export { useForceUpdate } from './reactjs/hooks/useForceUpdate'

// Utils
export * as arrayUtils from './utils/arrayUtils'
export * as vectorUtils from './utils/vectorUtils'
export { log } from './utils/log'

// THREEJS
export { AxesHelper } from './threejs/AxesHelper'
export { CustomGridTexture } from './threejs/CustomGridTexture'
export { DebugInfoTexture } from './threejs/DebugInfoTexture'
export { DefaultCube } from './threejs/DefaultCube'
export { DefaultGrid } from './threejs/DefaultGrid'
export { DirectionalLight } from './threejs/DirectionalLight'
export { HUDLayer } from './threejs/HUDLayer'
export { StandardRenderer } from './threejs/StandardRenderer'
export { TextSprite } from './threejs/TextSprite'
export { SkySphere } from './threejs/SkySphere'
export * from './threejs/threejsUtils'

// Three re-exports
export { Capsule } from 'three/examples/jsm/math/Capsule'
export { Octree } from 'three/examples/jsm/math/Octree'
export { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper'

// Constants
export * from './definitions'

// Custom types
export type * from './types/threejs.d.ts'
