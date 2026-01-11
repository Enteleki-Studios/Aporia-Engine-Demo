import { ReactNode } from 'react'

import './button.scss'

type ButtonProps = {
    children: ReactNode
    onClick?: () => void
}

export const Button = ({ children, onClick }: ButtonProps) => {
    return (
        <button className="Button" onClick={onClick}>
            {children}
        </button>
    )
}
