export const mapObject = <const T extends Record<PropertyKey, unknown>, V>(
    obj: T,
    fn: <K extends keyof T>(value: T[K], key: K) => V,
): { [K in keyof T]: V } => {
    const result: Partial<Record<keyof T, V>> = {}

    for (const key in obj) {
        result[key] = fn(obj[key], key)
    }

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- library code
    return result as { [K in keyof T]: V }
}
