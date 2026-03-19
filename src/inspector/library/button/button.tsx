import type { ReactNode } from 'react'

import './button.scss'

type ButtonProps = {
    children: ReactNode
    onClick?: () => void
    disabled?: boolean
}

export const Button = ({ children, onClick, disabled = false }: ButtonProps) => {
    return (
        <button className="Button" onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}
