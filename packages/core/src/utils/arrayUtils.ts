export const trimNumberArrayToString = (arr: number[], decimalPlaces = 2): string =>
    JSON.stringify(arr.map((number) => parseFloat(number.toFixed(decimalPlaces))))
