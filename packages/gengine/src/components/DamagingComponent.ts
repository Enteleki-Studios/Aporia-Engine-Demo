import { createComponent } from 'ecs'

type DamagingSettings = {
    radius: number
    theta: number
    spoolUp: number
    coolDown: number
    damage: number
}

type Stage = 'spooling' | 'cooling'

export const damagingComponent = createComponent(
    'damagingComponent',
    ({ radius, theta, spoolUp, coolDown, damage }: DamagingSettings): {
        radius: number,
        theta: number,
        damage: number,
        spoolUp: number,
        coolDown: number,
        delta: number,
        stage: Stage,
    } => ({
        radius,
        theta,
        damage,
        spoolUp,
        coolDown,
        delta: 0,
        stage: 'spooling',
    }),
)
