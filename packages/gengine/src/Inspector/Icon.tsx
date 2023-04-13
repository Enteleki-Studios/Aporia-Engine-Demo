import React from 'react'

import './Icon.scss'

type IconProps = {
    code: string
    onClick?: () => void
    title?: string
}

export const Icon = ({ code, onClick, title }: IconProps) => {
    if (onClick) {
        return (
            <button
                className="Icon"
                onClick={onClick}
                type="button"
                title={title}
            >
                <svg><image xlinkHref={`/resources/icons/${code}.svg`} /></svg>
            </button>
        )
    }
    return (
        <span className="Icon">
            <svg>
                <image xlinkHref={`/resources/icons/${code}.svg`} />
            </svg>
        </span>
    )
}
