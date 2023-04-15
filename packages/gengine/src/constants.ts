import { Vector3 } from 'three'
import npmPackage from '../package.json'

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
export const X_AXIS = new Vector3(1, 0, 0)
export const Y_AXIS = new Vector3(0, 1, 0)
export const Z_AXIS = new Vector3(0, 0, 1)

// Engine defaults
export const WORLD_MAX_DELTA = 0.05

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
