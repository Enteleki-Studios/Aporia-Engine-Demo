import { type ChangeEvent, type ReactNode, useCallback } from 'react'

import { useControlled } from '@enteleki-studios/aporia-engine-core/react'

import './checkbox.scss'

type CheckboxProps = {
    checked?: boolean
    defaultChecked?: boolean
    onChange?: (checked: boolean) => void
    switch?: boolean
    children?: ReactNode
    disabled?: boolean
}

export const Checkbox = ({
    checked,
    defaultChecked,
    onChange,
    children,
    disabled = false,
    ...props
}: CheckboxProps) => {
    const [isChecked, setIsChecked] = useControlled({
        controlledValue: checked,
        defaultValue: defaultChecked,
    })

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const nextChecked = e.currentTarget.checked
            setIsChecked(nextChecked)
            onChange?.(nextChecked)
        },
        [onChange, setIsChecked],
    )

    return (
        <div
            className={`Checkbox ${props.switch ? 'switch' : 'box'} ${isChecked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
        >
            <label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    defaultChecked={defaultChecked}
                    onChange={handleChange}
                />
                <div className="checkboxControl" />
                <span className="label">{children}</span>
            </label>
        </div>
    )
}
