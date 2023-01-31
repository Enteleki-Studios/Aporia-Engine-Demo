import { useReducer } from 'react'

const forceUpdateReducer = (x: number) => x + 1

/**
* Force update function for react function components
* Should be used very sparingly
*/
export const useForceUpdate = () => {
    const [, forceUpdate] = useReducer(forceUpdateReducer, 0)
    return forceUpdate
}
