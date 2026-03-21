import {
    ArrowLeftIcon,
    CaretDoubleRightIcon,
    FlaskIcon,
    InfoIcon,
    WarningIcon,
    XCircleIcon,
} from '@phosphor-icons/react'

export const kindToIcon = (kind: string) => {
    switch (kind) {
        case 'log':
            return null
        case 'warn':
            return <WarningIcon />
        case 'error':
            return <XCircleIcon />
        case 'info':
            return <InfoIcon />
        case 'input':
            return <CaretDoubleRightIcon />
        case 'result':
            return <ArrowLeftIcon />
        case 'debug':
            return <FlaskIcon />
        default:
            return null
    }
}
