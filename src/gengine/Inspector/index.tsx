import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'

import { selectors } from './redux'

import './index.scss'

interface Props {
    children: ReactNode,
}

export const Inspector = ({ children }: Props) => {
    const componentsByEntityId = useSelector(selectors.getComponentsByEntityId)

    return (
        <div className="Inspector">
            <div className="header">ECS Inspector</div>
            <div className="sidepanel">
                <div>Entities</div>
                <ul className="entities">
                    {Object.keys(componentsByEntityId).map((entityId) => (
                        <li key={entityId} className="entity">
                            <div>{entityId}</div>
                            <ul className="components">
                                {componentsByEntityId[entityId].map((component) => (
                                    <li key={component.type} className="component">
                                        <ul className="componentProperties">
                                            {Object.keys(component).map((componentProp) => (
                                                <li
                                                    key={componentProp}
                                                    className={`componentProp ${componentProp}`}
                                                >
                                                    <span>{`${componentProp}:`}</span>
                                                    <span>{component[componentProp]}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
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
