import { useEffect } from 'react'

import { usePersistentState } from '@core/react'

export const useSelectedTab = (ns: string, tabs: { title: string }[]) => {
    const defaultTab = tabs[0]?.title ?? ''

    const [value, setValue] = usePersistentState<string>(`selectedTab[${ns}]`, defaultTab)

    useEffect(() => {
        if (!tabs.some(({ title }) => title === value)) {
            setValue(defaultTab)
        }
    }, [value, setValue, defaultTab, tabs])

    return [value, setValue] as const
}
