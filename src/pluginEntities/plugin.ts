import { Entities } from './entities'

export const pluginEntities = () => ({
    createResources() {
        return {
            entities: new Entities(),
        }
    },
})

export type PluginEntities = ReturnType<typeof pluginEntities>
