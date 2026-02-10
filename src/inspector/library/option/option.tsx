import { ReactEventHandler, ReactNode } from 'react'

import './option.scss'

export type OptionValue = string | number | null

export type OptionProps<T extends OptionValue> = {
    children: ReactNode
    value: T
    selected?: boolean
    onClick?: ReactEventHandler<HTMLDivElement>
}

export const Option = <T extends OptionValue>({
    children,
    value,
    selected,
    onClick,
}: OptionProps<T>) => (
    <div
        className={`Option ${selected ? 'selected' : ''}`}
        data-value={value}
        onClick={onClick}
    >
        {children}
    </div>
)
