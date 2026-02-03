import { ReactNode } from 'react'

import './button.scss'

type ButtonProps = {
    children: ReactNode
    onClick?: () => void
    disabled?: boolean
}

export const Button = ({ children, onClick, disabled }: ButtonProps) => {
    return (
        <button className="Button" onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}
