import './divider.scss'

type DividerProps = {
    direction?: 'horizontal' | 'vertical'
}

export const Divider = ({ direction = 'horizontal' }: DividerProps) => (
    <hr className={`Divider ${direction}`} />
)
