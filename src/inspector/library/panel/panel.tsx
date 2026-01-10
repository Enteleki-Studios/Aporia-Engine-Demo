import { ReactNode } from 'react'

import './panel.scss'

type PanelProps = {
    children: ReactNode
}

export const Panel = ({ children }: PanelProps) => {
    return <div className="Panel">{children}</div>
}
