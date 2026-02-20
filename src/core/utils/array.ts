export const trimNumberArrayToString = (arr: number[], decimalPlaces = 2): string =>
    JSON.stringify(arr.map((number) => parseFloat(number.toFixed(decimalPlaces))))

const averageReducer = (acc: number, num: number) => acc + num
export const average = (a: number[]) => a.reduce(averageReducer, 0) / a.length

/**
 * Returns a new array with the elements of the first arg
 * alternating with the value of the second arg.
 *
 * @example floodWith([1, 2, 3], 'a') // [1, 'a', 2, 'a', 3]
 */
export const floodWith = <A, B>(a: A[], b: B): (A | B)[] =>
    a.flatMap((element: A, index: number, array: A[]) =>
        index === array.length - 1 ? [element] : [element, b],
    )

export const forOneOrEach = <T>(a: T | T[], cb: (b: T, i: number) => void) => {
    if (Array.isArray(a)) {
        a.forEach(cb)
    } else {
        cb(a, 0)
    }
}
