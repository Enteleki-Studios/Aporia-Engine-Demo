import { type ReactNode, useEffect, useState } from 'react'
import { RapierThreeVizPanel } from 'src/pluginRapierThreeViz/rapierThreeVizPanel'
import { ThreePanel } from 'src/pluginThree/threePanel'

import { ResourcesPanel, RuntimePanel } from '@core/react'

import { EntitiesPanel } from '@pluginEntities'

import './inspector.scss'

type InspectorProps = {
    children: ReactNode
}

export const Inspector = ({ children }: InspectorProps) => {
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

    return (
        <div className="Inspector">
            <div className="header">Inspector</div>
            <div className="sidepanel">
                <RuntimePanel />
                <EntitiesPanel />
            </div>
            <div className="explorer">
                <ResourcesPanel />
                <ThreePanel />
                <RapierThreeVizPanel />
            </div>
            <div className="views">
                <div className="game">{children}</div>
            </div>
            <footer>Enteleki Studios</footer>
        </div>
    )
}
