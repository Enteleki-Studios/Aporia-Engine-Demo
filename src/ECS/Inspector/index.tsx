import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'

import { selectors } from './redux'

import './index.scss'

interface Props {
    children: ReactNode,
}

export const Inspector = ({ children }: Props) => {
    const entities = useSelector(selectors.getEntities)

    return (
        <div className="Inspector">
            <div className="header">ECS Inspector</div>
            <div className="sidepanel">
                Entities:
                {entities.map((e) => (
                    <div key={e}>{e}</div>
                ))}
            </div>
            <div className="preview">
                {children}
            </div>
            <div className="log">Log</div>
        </div>
    )
}
