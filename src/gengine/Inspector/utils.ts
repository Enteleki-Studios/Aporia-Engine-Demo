export const secondsToClockString = (seconds: number, decimalPlaces = 0) => {
    const secsMinLength = decimalPlaces ? 3 + decimalPlaces : 2
    const secs = (seconds % 60).toFixed(decimalPlaces).padStart(secsMinLength, '0')
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')

    return `${hours}:${minutes}:${secs}`
}

// TODO move this to actual tests
const testSecondsToClockString = () => {
    console.debug('Testing secondsToClockString()')

    const tests = [
        ['00:00:05', 5],
        ['00:00:55', 55],
        ['00:01:00', 60],
        ['00:01:30', 90],
        ['00:10:00', 60 * 10],
        ['01:00:00', 60 * 60],
        ['01:32:07', (60 * 60) + (60 * 32) + (7)],
    ] as const

    tests.forEach((t) => {
        const output = secondsToClockString(t[1])

        console.assert(
            output === t[0],
            t[1],
            `wanted: ${t[0]}`,
            `got: ${output}`,
        )
    })
}

testSecondsToClockString()
