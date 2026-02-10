import { ReactNode } from 'react'

import './table.scss'

type TableProps = {
    children: ReactNode
}

export const Table = ({ children }: TableProps) => (
    <table className="Table">{children}</table>
)

type THeadProps = {
    children: ReactNode
}

export const THead = ({ children }: THeadProps) => (
    <thead className="THead">{children}</thead>
)

type TBodyProps = {
    children: ReactNode
}

export const TBody = ({ children }: TBodyProps) => (
    <tbody className="TBody">{children}</tbody>
)

type TRowProps = {
    children: ReactNode
}

export const TRow = ({ children }: TRowProps) => <tr className="TRow">{children}</tr>

type TCell = {
    children: ReactNode
}

export const TCell = ({ children }: TCell) => <td className="TCell">{children}</td>
