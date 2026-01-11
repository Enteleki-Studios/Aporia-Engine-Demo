import { ReactNode } from 'react'

import './buttonBar.scss'

type ButtonBarProps = {
    children: ReactNode
    spacing?: number
}

export const ButtonBar = ({ children, spacing = 1 }: ButtonBarProps) => {
    return (
        <div className="ButtonBar" style={{ gap: `${spacing / 2}rem` }}>
            {children}
        </div>
    )
}
