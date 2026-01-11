import { ReactNode, useCallback } from 'react'

import './toggle.scss'

type ToggleProps = {
    checked?: boolean
    onChange: (value: boolean) => void
    children?: ReactNode
}

// TODO: For now this component must be controlled
// but could be expanded to be uncontrolled optionally
// passed a defaultChecked prop

export const Toggle = ({ checked = false, onChange, children }: ToggleProps) => {
    const handleClick = useCallback(() => {
        onChange(!checked)
    }, [checked, onChange])

    return (
        <span className="Toggle">
            {children && <label>{children}</label>}
            <ToggleControl checked={checked} onClick={handleClick} />
        </span>
    )
}

const ToggleControl = ({
    checked,
    onClick,
}: {
    checked: boolean
    onClick: () => void
}) => {
    return (
        <span className={`ToggleControl ${checked ? 'on' : 'off'}`} onClick={onClick} />
    )
}
