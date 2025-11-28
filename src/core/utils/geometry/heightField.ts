export const generateHeightfield = (ncols: number, nrows: number = ncols) => {
    const heights = []

    for (let i = 0; i <= ncols; i++) {
        for (let j = 0; j <= nrows; j++) {
            heights.push(Math.random())
        }
    }

    return heights
}
