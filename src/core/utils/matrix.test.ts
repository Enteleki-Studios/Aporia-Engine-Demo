import { expect, test } from 'vitest'

import { transpose1D } from './matrix'

test('Can transpose a 1-dimensional array matrix', () => {
    // prettier-ignore
    const input = [
        1,  2,  3,  4,
        5,  6,  7,  8,
        9, 10, 11, 12,
    ]

    // prettier-ignore
    const expectedOutput = [
        1, 5,  9,
        2, 6, 10,
        3, 7, 11,
        4, 8, 12,
    ]

    const output = transpose1D(input, 3, 4)
    expect(output).toEqual(expectedOutput)

    const output2 = transpose1D(output, 4, 3)
    expect(output2).toEqual(input)
})
