import type { ReactNode } from 'react'

import {
    CheckCircleIcon,
    InfoIcon,
    WarningIcon,
    XCircleIcon,
} from '@phosphor-icons/react'

import './alert.scss'

type Severity = 'info' | 'success' | 'warning' | 'error'

type AlertProps = {
    children: ReactNode
    severity?: Severity
}

const sevToIcon = (severity: Severity) => {
    switch (severity) {
        case 'info':
            return <InfoIcon />
        case 'success':
            return <CheckCircleIcon />
        case 'warning':
            return <WarningIcon />
        case 'error':
            return <XCircleIcon />
    }
}

export const Alert = ({ children, severity = 'info' }: AlertProps) => {
    const icon = sevToIcon(severity)

    return (
        <div className={`Alert ${severity}`}>
            <span className="icon">{icon}</span>
            {children}
        </div>
    )
}
