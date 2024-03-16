import { useRef } from 'react'
import { average } from 'utils/arrayUtils'

export const useSmoothNumber = (value: number, history: number = 10) => {
    const numbersRef = useRef<number[]>([])

    numbersRef.current.push(value)

    if (numbersRef.current.length > history) {
        numbersRef.current.shift()
    }

    return average(numbersRef.current)
}
