import './checkbox.scss'

type CheckboxProps = {
    checked: boolean
    onClick?: () => void
    children?: string
}

export const Checkbox = ({ checked, onClick, children }: CheckboxProps) => (
    <div className={`Checkbox ${checked ? 'checked' : ''}`}>
        <label>
            <input type="checkbox" checked={checked} onClick={onClick} />
            <div className="box" />
            <span>{children}</span>
        </label>
    </div>
)
