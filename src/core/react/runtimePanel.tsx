import { useRenderSync } from './useRenderSync'
import { useSmoothNumber } from './useSmoothNumber'
import { useWorld } from './useWorld'

export const RuntimePanel = () => {
    useRenderSync()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- World<any> is intentional for generic debug panel
    const world = useWorld()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- World<any> is intentional
    const { runtime } = world

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- World<any> is intentional
    const smoothFps = useSmoothNumber(runtime.clock.fps, 50)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- World<any> is intentional
    const smoothFrameLength = useSmoothNumber(runtime.clock.frameLength, 50)

    return (
        <div>
            <h3>Runtime</h3>
            <pre>FPS: {Math.floor(smoothFps)}</pre>
            <pre>Length: {smoothFrameLength.toFixed(1)}ms</pre>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- World<any> is intentional */}
            <pre>Frames: {runtime.clock.frames}</pre>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- World<any> is intentional */}
            <pre>Systems: {runtime.systems.length}</pre>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- World<any> is intentional */}
            <pre>Systems(debug): {runtime.debugSystems.length}</pre>
        </div>
    )
}
