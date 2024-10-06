import React from 'react'

import './Icon.scss'

type IconProps = {
    icon: React.ReactNode
    onClick?: () => void
    title?: string
    disabled?: boolean | undefined
}

export const Icon = ({ icon, onClick, title, disabled }: IconProps) => {
    if (onClick) {
        return (
            <button disabled={disabled} className="Icon" onClick={onClick} type="button" title={title}>
                {icon}
            </button>
        )
    }
    return <i className="Icon">{icon}</i>
}
