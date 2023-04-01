export const secondsToClockString = (seconds: number, decimalPlaces = 0) => {
    const secsMinLength = decimalPlaces ? 3 + decimalPlaces : 2
    const secs = (seconds % 60).toFixed(decimalPlaces).padStart(secsMinLength, '0')
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')

    return `${hours}:${minutes}:${secs}`
}
