import { useEffect, useState } from 'react'

export function useIntervalRender(delay: number | null) {
    const [, forceRender] = useState(0)

    useEffect(() => {
        if (delay === null) {
            return
        }

        const id = setInterval(() => {
            forceRender((n) => n + 1)
        }, delay)

        return () => {
            clearInterval(id)
        }
    }, [delay])
}
