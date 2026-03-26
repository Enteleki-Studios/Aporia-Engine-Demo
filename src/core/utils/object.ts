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

export const objectEntries = <
    const T extends Record<PropertyKey, V>,
    K extends keyof T,
    V,
>(
    obj: T,
): [K, T[K]][] => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- library code
    return Object.entries(obj) as [K, T[K]][]
}

export const recordFromArray = <const K extends readonly string[], V>(
    a: K,
    fn: (k: K[number]) => V,
): Record<K[number], V> =>
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- library code
    Object.fromEntries(a.map((k) => [k, fn(k)])) as Record<K[number], V>
