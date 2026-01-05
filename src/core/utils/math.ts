export const clamp = (value: number, min: number, max: number) =>
    Math.max(Math.min(value, max), min)

export const wrapAnglePi = (a: number): number => {
    let angle = (a + Math.PI) % (2 * Math.PI)

    if (angle < 0) {
        angle += 2 * Math.PI
    }

    return angle - Math.PI
}
