import { type Entity } from 'ecs'

import npmPackage from '../package.json'

// Input management
export type Keymap = Record<string, string | string[]>

export const DEFAULT_KEYMAP: Keymap = {
    up: ['ArrowUp', 'KeyW'],
    down: ['ArrowDown', 'KeyS'],
    left: ['ArrowLeft', 'KeyA'],
    right: ['ArrowRight', 'KeyD'],
    run: 'ShiftLeft',
    attack: 'Space',
    debug: 'Backquote',
}

// Utilities
export type Array2 = [number, number]
export type Array3 = [number, number, number]
export type Array4 = [number, number, number, number]

export const X_AXIS: Readonly<Array3> = Object.freeze([1, 0, 0])
export const Y_AXIS: Readonly<Array3> = Object.freeze([0, 1, 0])
export const Z_AXIS: Readonly<Array3> = Object.freeze([0, 0, 1])
export const ORIGIN: Readonly<Array3> = Object.freeze([0, 0, 0])

// Engine defaults
// Max reported frame length
export const WORLD_MAX_DELTA_DEFAULT = 0.1
// Min reported frame length
export const WORLD_MIN_DELTA_DEFAULT = 0.001
// How many frames to average for fps stats
export const AGG_SIZE_DEFAULT = 10

// Rendering
export type DebugMode = 'game' | 'debug' | 'sideBySide'
export const DebugModes: { value: DebugMode; label: string }[] = [
    { value: 'game', label: 'Game' },
    { value: 'debug', label: 'Debug' },
    { value: 'sideBySide', label: 'Game + Debug' },
]

// World events
export type WorldEvent = 'start' | 'stop' | 'endframe'

// Extras
export const ENGINE_VERSION = `${npmPackage.version} - alpha`

// Utility types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

// Engine types
export type Query = {
    match(entity: Entity): boolean
}
