export const trimNumberArrayToString = (arr: number[], decimalPlaces = 2): string =>
    JSON.stringify(arr.map((number) => parseFloat(number.toFixed(decimalPlaces))))

const averageReducer = (acc: number, num: number) => acc + num
export const average = (a: number[]) => a.reduce(averageReducer, 0) / a.length
