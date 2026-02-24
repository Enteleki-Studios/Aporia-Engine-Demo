import { useState } from 'react'

type UseControlledProps<T> = {
    controlledValue: T | undefined
    defaultValue: T | undefined
}

export const useControlled = <T>({
    controlledValue,
    defaultValue,
}: UseControlledProps<T>): [T | undefined, (nextValue: T) => void] => {
    const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(
        defaultValue,
    )

    const isControlled = controlledValue !== undefined

    const value = isControlled ? controlledValue : uncontrolledValue

    return [value, setUncontrolledValue]
}
