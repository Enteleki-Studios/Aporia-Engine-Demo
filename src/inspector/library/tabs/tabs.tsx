import { ReactNode } from 'react'

import './tabs.scss'
import { useSelectedTab } from './useSelectedTab'

type Tab = {
    title: string
    content: ReactNode
    icon?: ReactNode
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
                {tabs.map(({ title, icon }) => {
                    const isActive = title === activeTab
                    const hasIcon = Boolean(icon)
                    return (
                        <button
                            key={title}
                            className={`tabView ${isActive ? 'active' : ''} ${hasIcon ? 'hasIcon' : ''}`}
                            title={title}
                            onClick={() => {
                                setActiveTab(title)
                            }}
                        >
                            {icon}
                            <span className="title">{title}</span>
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
