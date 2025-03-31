const clamp = (min: number, max: number, value: number) => Math.min(max, Math.max(min, value))

export class Clock {
    // Settings
    /** Maximum value of delta to avoid giant leaps in time */
    maxDelta = 0.1
    /** Minimum value of delta to avoid division by zero */
    minDelta = 0.001
    /**  Target fps used to calculate frameRemaining */
    private _fpsTarget = 60
    /** Frame length target in ms. Updated when fpsTarget is set */
    private _frameBudget = (1 / 60) * 1000

    // Internal
    /** Time when clock was created in ms */
    clockStart: number
    /** Time when current frame started in ms */
    frameStart: number
    /** Time when current frame ended in ms */
    frameEnd: number

    // Output
    /** Time between the start of the last frame and the start of the current frame in sec */
    delta = this.minDelta
    /** Same as delta, but unclamped in sec */
    trueDelta = 0
    /** Precalculated fps */
    fps = 0
    /** Time it took to perform all work in the previous frame in ms */
    frameLength = 0
    /** Time remaining in frame budget in the previous frame in ms */
    frameRemaining = 0
    /** Total number of frames recorded */
    frames = 0
    /** Total time passed since clock start in sec */
    elapsedTime = 0

    static now() {
        return performance.now()
    }

    constructor() {
        const now = Clock.now()

        this.clockStart = now
        this.frameStart = now
        this.frameEnd = now
    }

    set fpsTarget(target: number) {
        this._fpsTarget = target
        this._frameBudget = (1 / target) * 1000
    }

    /** Target fps used to calculate frameRemaining */
    get fpsTarget() {
        return this._fpsTarget
    }

    /** Frame length target in ms. Updated when fpsTarget is set */
    get frameBudget() {
        return this._frameBudget
    }

    /** Mark the start of a new frame */
    startFrame() {
        this.trueDelta = (Clock.now() - this.frameStart) / 1000
        this.frameStart = Clock.now()
        this.delta = clamp(this.minDelta, this.maxDelta, this.trueDelta)
        this.fps = Math.floor(1 / this.trueDelta)
        this.elapsedTime = (Clock.now() - this.clockStart) / 1000
    }

    /** Mark the end of all work that needed to be done this frame */
    endFrame() {
        this.frameEnd = Clock.now()
        this.frameLength = this.frameEnd - this.frameStart
        this.frameRemaining = this._frameBudget - this.frameLength
        this.frames += 1
    }
}
