import { useReducer } from 'react'

const forceUpdateReducer = (x: number) => x + 1

/**
 * Forces a component re-render
 */
export const useForceUpdate = () => {
    const [, forceUpdate] = useReducer(forceUpdateReducer, 0)
    return forceUpdate
}
