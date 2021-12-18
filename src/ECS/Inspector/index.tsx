import React, { useRef, useEffect, ReactNode } from 'react'

import type Dungeon from 'Dungeon'

import './index.scss'

interface Props {
    children: ReactNode,
}

export const Inspector = ({ children }: Props) => (
    <div className="Inspector">
        <div className="header">ECS Inspector</div>
        <div className="sidepanel">Entities</div>
        <div className="preview">
            {children}
        </div>
        <div className="log">Log</div>
    </div>
)
