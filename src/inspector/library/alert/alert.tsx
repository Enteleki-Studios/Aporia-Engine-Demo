import type { ReactNode } from 'react'

import './alert.scss'

type AlertProps = {
    children: ReactNode
    severity?: 'info' | 'success' | 'warning' | 'error'
}

export const Alert = ({ children, severity = 'info' }: AlertProps) => {
    return <div className={`Alert ${severity}`}>{children}</div>
}
