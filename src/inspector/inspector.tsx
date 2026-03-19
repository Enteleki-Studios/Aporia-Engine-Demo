import { type ReactNode, useEffect, useState } from 'react'

import './inspector.scss'

type InspectorProps = {
    children: ReactNode
    sidepanelContent?: ReactNode
    explorerContent?: ReactNode
}

export const Inspector = ({
    children,
    sidepanelContent,
    explorerContent,
}: InspectorProps) => {
    const [isPassthrough, setIsPassthrough] = useState(false)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Backquote') {
                setIsPassthrough((prev) => !prev)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    if (isPassthrough) {
        return children
    }

    const currentYear = new Date().getFullYear()

    return (
        <div className="Inspector">
            <div className="header">Inspector</div>
            <div className="sidepanel">{sidepanelContent}</div>
            <div className="explorer">{explorerContent}</div>
            <footer>&copy; {currentYear} Enteleki Studios</footer>
            <div className="views">
                <div className="game">{children}</div>
            </div>
        </div>
    )
}
