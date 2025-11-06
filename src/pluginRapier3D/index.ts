import { type Plugin } from '@core'

export type Rapier = typeof import('@dimforge/rapier3d')

export const getRapier = () => import('@dimforge/rapier3d')

type Provides = {
    physics: {
        rapier: Rapier
    }
}

export const pluginRapier3D = (): Plugin<Provides> => ({
    createResources: async () => {
        const rapier = await getRapier()

        return {
            physics: {
                rapier,
            },
        }
    },
})
