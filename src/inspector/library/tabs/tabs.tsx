import { ReactNode } from 'react'

import './tabs.scss'
import { useSelectedTab } from './useSelectedTab'

type Tab = {
    title: string
    content: ReactNode
}

type TabsProps = {
    tabs: Tab[]
    ns: string
}

export const Tabs = ({ ns, tabs }: TabsProps) => {
    const [activeTab, setActiveTab] = useSelectedTab(ns, tabs)

    return (
        <div className="Tabs">
            <div className="tabNav">
                {tabs.map(({ title }) => {
                    const isActive = title === activeTab
                    return (
                        <button
                            key={title}
                            className={`tabView ${isActive ? 'active' : ''}`}
                            title={title}
                            onClick={() => {
                                setActiveTab(title)
                            }}
                        >
                            {title}
                        </button>
                    )
                })}
            </div>
            <div className="tabContent">
                {tabs.map(({ title, content }) => {
                    const isActive = title === activeTab
                    return (
                        <div
                            className={`tabView ${isActive ? 'active' : ''}`}
                            key={title}
                            style={{ display: isActive ? 'block' : 'none' }}
                        >
                            {content}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
