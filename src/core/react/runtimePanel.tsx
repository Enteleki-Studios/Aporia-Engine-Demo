import { useRenderSync } from './useRenderSync'
import { useSmoothNumber } from './useSmoothNumber'
import { useWorld } from './useWorld'

export const RuntimePanel = () => {
    useRenderSync()
    const world = useWorld()

    const smoothFps = useSmoothNumber(world.clock.fps, 20)

    return (
        <div>
            <h3>Runtime</h3>
            <pre>FPS: {Math.floor(smoothFps)}</pre>
            <pre>Frames: {world.clock.frames}</pre>
            {/* @ts-expect-error Accessing a private prop */}
            <pre>Systems: {world.systems.length}</pre>
        </div>
    )
}
