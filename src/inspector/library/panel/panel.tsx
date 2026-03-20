import { ReactNode } from 'react'

import './panel.scss'

type PanelProps = {
    children: ReactNode
    className?: string
}

export const Panel = ({ children, className }: PanelProps) => {
    return <div className={`Panel ${className}`}>{children}</div>
}
