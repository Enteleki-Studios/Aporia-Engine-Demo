import { useLayoutEffect, useRef, useState } from 'react'

import { average } from '@core/utils'

export const useSmoothNumber = (value: number, history = 10) => {
    const numbersRef = useRef<number[]>([])
    const [avg, setAvg] = useState(0)

    useLayoutEffect(() => {
        numbersRef.current.push(value)

        if (numbersRef.current.length > history) {
            numbersRef.current.shift()
        }

        setAvg(average(numbersRef.current))
    }, [value, history])

    return avg
}
