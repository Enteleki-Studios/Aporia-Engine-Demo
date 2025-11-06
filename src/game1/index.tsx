import { use } from 'react'

import { WorldContext } from '@core/react'

import { Inspector } from '@inspector'

import { game1 } from './engineDef'
import { Game } from './game'
import './index.scss'

const worldPromise = game1()

export const Root = () => {
    const world = use(worldPromise)

    return (
        <WorldContext value={world}>
            <Inspector>
                <Game />
            </Inspector>
        </WorldContext>
    )
}
