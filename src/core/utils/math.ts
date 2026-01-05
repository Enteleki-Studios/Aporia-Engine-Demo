export const clamp = (value: number, min: number, max: number) =>
    Math.max(Math.min(value, max), min)

const PI = Math.PI
const TAU = 2 * PI
export const wrapAnglePi = (a: number): number => {
    let angle = (a + PI) % TAU

    if (angle < 0) {
        angle += TAU
    }

    return angle - PI
}
