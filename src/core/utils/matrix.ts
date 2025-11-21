export const transpose1D = (
    matrix: number[],
    width: number,
    height: number,
): number[] => {
    const output = []

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            output[j * width + i] = matrix[i * height + j] ?? 0
        }
    }

    return output
}
