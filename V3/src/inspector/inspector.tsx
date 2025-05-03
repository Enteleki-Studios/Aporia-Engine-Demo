import { ReactNode } from 'react'

import './inspector.scss'

type InspectorProps = {
    children: ReactNode
}

export const Inspector = ({ children }: InspectorProps) => {
    return (
        <div className="Inspector">
            <div className="header">Inspector</div>
            <div className="sidepanel">sidepanel</div>
            <div className="explorer">explorer</div>
            <div className="views">
                <div className="game">{children}</div>
            </div>
            <footer>footer</footer>
        </div>
    )
}
