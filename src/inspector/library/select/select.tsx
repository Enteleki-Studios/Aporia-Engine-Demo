import { ReactElement, cloneElement, useCallback, useState } from 'react'

import type { OptionProps, OptionValue } from '@inspector'

import './select.scss'

type SelectProps<T extends OptionValue> = {
    value: T
    children: ReactElement<OptionProps<T>>[]
    defaultOpen?: boolean
    onChange?: (value: T) => void
    label?: string
}

export const Select = <T extends OptionValue>({
    value,
    children,
    defaultOpen = false,
    onChange,
    label,
}: SelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    const selectedChild = children.find((child) => child.props.value === value)

    const items = children.map((child) =>
        cloneElement(child, {
            selected: child.props.value === value,
            onClick: () => {
                onChange?.(child.props.value)
            },
        }),
    )

    const handleClick = useCallback(() => {
        setIsOpen((p) => !p)
    }, [])

    return (
        <div className="Select">
            {label && <div className="label">{label}</div>}
            <div
                className={`dropdown ${isOpen ? 'open' : 'closed'}`}
                onClick={handleClick}
            >
                <div className="selection">{selectedChild?.props.children}</div>
                <div className="options">{items}</div>
            </div>
        </div>
    )
}
