import { ReactNode } from 'react'

import './stack.scss'

type StackProps = {
    children: ReactNode
    spacing?: number
    fullWidth?: boolean
    direction?: 'column' | 'row'
}

export const Stack = ({
    children,
    spacing = 1,
    fullWidth = false,
    direction = 'column',
}: StackProps) => (
    <div
        className="Stack"
        style={{
            gap: `${spacing / 2}rem`,
            display: fullWidth ? 'flex' : 'inline-flex',
            flexDirection: direction,
        }}
    >
        {children}
    </div>
)
