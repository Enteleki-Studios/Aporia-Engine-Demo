/* eslint-disable @typescript-eslint/consistent-type-assertions -- Need to cast JSON.parse */
import { useCallback, useEffect, useState } from 'react'
import type { JsonObject } from 'type-fest'

type Value = number | string | boolean | JsonObject

export const usePersistentState = <T extends Value>(key: string, initialValue: T) => {
    const [value, setValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch (_e) {
            return initialValue
        }
    })

    // Set hook state + update localStorage value
    const setStoredValue = useCallback(
        (next: T | ((prev: T) => T)) => {
            setValue((prevValue) => {
                const nextValue = typeof next === 'function' ? next(prevValue) : next

                try {
                    // TODO: Don't love the effect in a setState
                    // callback, but moving it to a useEffect will
                    // cause an infinite loop... Needs some more thought
                    const stringValue = JSON.stringify(nextValue)
                    window.localStorage.setItem(key, stringValue)
                } catch (_e) {
                    /**/
                }

                return nextValue
            })
        },
        [key],
    )

    // Listen for changes in other tabs
    useEffect(() => {
        const handleStorageEvent = (event: StorageEvent) => {
            if (event.key === key) {
                const newValue = event.newValue

                try {
                    if (newValue === null) {
                        setValue(initialValue)
                    } else {
                        setValue(JSON.parse(newValue) as T)
                    }
                } catch (_e) {
                    setValue(initialValue)
                }
            }
        }

        window.addEventListener('storage', handleStorageEvent)

        return () => {
            window.removeEventListener('storage', handleStorageEvent)
        }
    }, [key, initialValue])

    return [value, setStoredValue] as const
}
/* eslint-enable @typescript-eslint/consistent-type-assertions -- Need to cast JSON.parse */
