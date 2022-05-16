import { Vector3 } from 'three'

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

export const X_AXIS = new Vector3(1, 0, 0)
export const Y_AXIS = new Vector3(0, 1, 0)
export const Z_AXIS = new Vector3(0, 0, 1)
