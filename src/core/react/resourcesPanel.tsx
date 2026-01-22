import { useWorld } from '@core/react'

export const ResourcesPanel = () => {
    // TODO: Smarter list of resources, this is a placeholder
    const world = useWorld()

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Assume world is an object
    const topLevelResources = Object.keys(world as object).filter(
        (key) => key !== 'runtime',
    )

    return (
        <div>
            <h3>Resources</h3>
            <pre>{topLevelResources.join('\n')}</pre>
        </div>
    )
}
