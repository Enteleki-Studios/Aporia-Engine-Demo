import type { Plugin } from '@core'

const clamp = (min: number, max: number, value: number) =>
    Math.min(max, Math.max(min, value))

type Clock = {
    frame: number
    clockStart: number
    elapsedTime: number
    trueDelta: number
    delta: number
    fps: number
    minDelta: number
    maxDelta: number
    frameStart: number
    now(): number
}

export const pluginClock = (): Plugin<{ clock: Clock }> => ({
    createResources() {
        const clock = {
            frame: 0,
            clockStart: 0,
            elapsedTime: 0,
            trueDelta: 0,
            delta: 0,
            fps: 0,
            minDelta: 0.001,
            maxDelta: 0.1,
            frameStart: 0,
            now() {
                return performance.now()
            },
        }

        return { clock }
    },
    init(runtime) {
        runtime.addSystem((world) => {
            const { clock } = world.resources

            const now = clock.now()

            if (!clock.clockStart) {
                clock.clockStart = now
            }

            clock.trueDelta = (now - clock.frameStart) / 1000
            clock.delta = clamp(clock.minDelta, clock.maxDelta, clock.trueDelta)
            clock.fps = Math.floor(1 / clock.trueDelta)

            clock.frame += 1
            clock.elapsedTime = (now - clock.clockStart) / 1000
            clock.frameStart = now
        })
    },
})
