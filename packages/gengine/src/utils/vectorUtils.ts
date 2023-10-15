import { Array2, Array3 } from 'definitions'

export const roundToZero = (out: Array3, a: Readonly<Array3>, threshold = 0.0001) => {
    out[0] = Math.abs(a[0]) <= threshold ? 0 : a[0]
    out[1] = Math.abs(a[1]) <= threshold ? 0 : a[1]
    out[2] = Math.abs(a[2]) <= threshold ? 0 : a[2]

    return out
}

export const angle2 = (a: Readonly<Array2>) => {
    return Math.atan2(-a[1], -a[0]) + Math.PI
}
