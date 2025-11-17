import { useWorld } from '@core/react'

export const ResourcesPanel = () => {
    // TODO: Smarter list of resources, this is a placeholder
    const world = useWorld()

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Assume that resources is an object in our any world
    const topLevelResources = Object.keys(world.resources as object)

    return (
        <div>
            <h3>Resources</h3>
            <pre>{topLevelResources.join('\n')}</pre>
        </div>
    )
}
