import { use, useEffect, useState } from 'react'

import { WorldContext } from '@core/react'

import { Inspector } from '@inspector'

import { game1 } from './engineDef'
import { Game } from './game'
import './index.scss'

const worldPromise = game1()

export const Root = () => {
    const [isPassthrough, setIsPassthrough] = useState(false)
    const world = use(worldPromise)

    useEffect(() => {
        const togglePassthroughMode = (event: KeyboardEvent) => {
            if (event.code === 'Backquote') {
                setIsPassthrough((prev) => !prev)
            }
        }

        document.addEventListener('keydown', togglePassthroughMode)

        return () => {
            document.removeEventListener('keydown', togglePassthroughMode)
        }
    }, [])

    return (
        <WorldContext value={world}>
            <Inspector passthrough={isPassthrough}>
                <Game />
            </Inspector>
        </WorldContext>
    )
}
