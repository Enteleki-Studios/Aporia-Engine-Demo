import React from 'react'

import './Icon.scss'

type IconProps = {
    icon: React.ReactNode
    onClick?: () => void
    title?: string
}

export const Icon = ({ icon, onClick, title }: IconProps) => {
    if (onClick) {
        return (
            <button className="Icon" onClick={onClick} type="button" title={title}>
                {icon}
            </button>
        )
    }
    return <span className="Icon">{icon}</span>
}
