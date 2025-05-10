import { ReactNode } from 'react'

import './inspector.scss'

type InspectorProps = {
    children: ReactNode
    passthrough?: boolean
}

export const Inspector = ({ children, passthrough }: InspectorProps) => {
    if (passthrough) {
        return children
    }

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
