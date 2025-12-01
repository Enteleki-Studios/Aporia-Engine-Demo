import { useRenderSync } from './useRenderSync'
import { useSmoothNumber } from './useSmoothNumber'
import { useWorld } from './useWorld'

export const RuntimePanel = () => {
    useRenderSync()
    const world = useWorld()

    const smoothFps = useSmoothNumber(world.clock.fps, 50)
    const smoothFrameLength = useSmoothNumber(world.clock.frameLength, 50)

    return (
        <div>
            <h3>Runtime</h3>
            <pre>FPS: {Math.floor(smoothFps)}</pre>
            <pre>Length: {smoothFrameLength.toFixed(1)}ms</pre>
            <pre>Frames: {world.clock.frames}</pre>
            {/* @ts-expect-error Accessing a private prop */}
            <pre>Systems: {world.systems.length}</pre>
            {/* @ts-expect-error Accessing a private prop */}
            <pre>Systems(debug): {world.debugSystems.length}</pre>
        </div>
    )
}
