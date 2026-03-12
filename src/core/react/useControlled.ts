import { Dispatch, SetStateAction, useState } from 'react'

type UseControlledProps<T> = {
    controlledValue: T | undefined
    defaultValue: T | undefined
}

export const useControlled = <T>({
    controlledValue,
    defaultValue,
}: UseControlledProps<T>): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
    const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(
        defaultValue,
    )

    const isControlled = controlledValue !== undefined

    const value = isControlled ? controlledValue : uncontrolledValue

    return [value, setUncontrolledValue]
}
