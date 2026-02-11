import { ReactNode } from 'react'

import './table.scss'

type TableProps = {
    children?: ReactNode
    cols?: string
}

export const Table = ({ children, cols = '1fr 1fr' }: TableProps) => (
    <div className="Table" style={{ gridTemplateColumns: cols }}>
        {children}
    </div>
)

type THeadProps = {
    children?: ReactNode
}

export const THead = ({ children }: THeadProps) => <div className="THead">{children}</div>

type TBodyProps = {
    children?: ReactNode
}

export const TBody = ({ children }: TBodyProps) => <div className="TBody">{children}</div>

type TRowProps = {
    children?: ReactNode
}

export const TRow = ({ children }: TRowProps) => <div className="TRow">{children}</div>

type TCell = {
    children?: ReactNode
}

export const TCell = ({ children }: TCell) => <div className="TCell">{children}</div>
