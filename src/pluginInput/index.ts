export * from './plugin'
export * from './inputManager'

export type Keymap = Record<string, string>

export const DEFAULT_KEYMAP = {
    left: 'KeyA',
    right: 'KeyD',
    up: 'KeyW',
    down: 'KeyS',
    space: 'Space',
    shift: 'ShiftLeft',
} as const satisfies Keymap
