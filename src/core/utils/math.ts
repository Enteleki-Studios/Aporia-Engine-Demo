const PI = Math.PI
const TAU = 2 * PI
const RAD_TO_DEG = 180 / PI
const DEG_TO_RAD = PI / 180

export const clamp = (value: number, min: number, max: number) =>
    Math.max(Math.min(value, max), min)

export const wrapAnglePi = (a: number): number => {
    let angle = (a + PI) % TAU

    if (angle < 0) {
        angle += TAU
    }

    return angle - PI
}

export const radToDeg = (rad: number): number => rad * RAD_TO_DEG

export const degToRad = (deg: number): number => deg * DEG_TO_RAD
