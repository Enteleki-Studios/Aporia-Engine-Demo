import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'

import { selectors } from './redux'

import './index.scss'

interface Props {
    children: ReactNode,
}

export const Inspector = ({ children }: Props) => {
    const componentsByEntity = useSelector(selectors.getComponentsByEntity)

    return (
        <div className="Inspector">
            <div className="header">ECS Inspector</div>
            <div className="sidepanel">
                <div>Components</div>
                <ul>
                    {Object.keys(componentsByEntity).map((entityId) => (
                        <li key={entityId}>
                            <div>{entityId}</div>
                            <ul>
                                {componentsByEntity[entityId].map((type) => (
                                    <li key={type}>{type}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="preview">
                {children}
            </div>
            <div className="log">Log</div>
        </div>
    )
}
