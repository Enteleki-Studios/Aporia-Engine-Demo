import { useWorld } from '@core/react'

export const ResourcesPanel = () => {
    // TODO: Smarter list of resources, this is a placeholder
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- World<any> is intentional for generic debug panel
    const world = useWorld()

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Assume world is an object
    const topLevelResources = Object.keys(world as object)

    return (
        <div>
            <h3>Resources</h3>
            <pre>{topLevelResources.join('\n')}</pre>
        </div>
    )
}
