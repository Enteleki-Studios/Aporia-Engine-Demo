import { ReactNode } from 'react'

import { floodWith } from '@core/utils'

import './stack.scss'

type StackProps = {
    children: ReactNode
    spacing?: number
    divider?: ReactNode
    fullWidth?: boolean
}

export const Stack = ({
    children,
    spacing = 1,
    divider,
    fullWidth = false,
}: StackProps) => {
    const contents =
        Array.isArray(children) && divider ? floodWith(children, divider) : children

    return (
        <div
            className="Stack"
            style={{
                gap: `${spacing / 2}rem`,
                display: fullWidth ? 'flex' : 'inline-flex',
            }}
        >
            {contents}
        </div>
    )
}
