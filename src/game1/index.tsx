import { use } from 'react'

import { ResourcesPanel, WorldContext } from '@core/react'

import { Divider, Inspector, Stack, Tabs } from '@inspector'
import { ClockPanel } from '@pluginClock'
import { EntitiesPanel } from '@pluginEntities'
import { RapierThreeVizPanel } from '@pluginRapierThreeViz'
import { RuntimePanel } from '@pluginRuntime'
import { ThreePanel } from '@pluginThree'

import { Game } from './game'
import './index.scss'
import { setup } from './setup'

const worldPromise = setup()

export const Root = () => {
    const world = use(worldPromise)

    return (
        <WorldContext value={world}>
            <Inspector
                sidepanelContent={
                    <Stack divider={<Divider />} fullWidth>
                        <ClockPanel />
                        <RuntimePanel />
                        <EntitiesPanel />
                    </Stack>
                }
                explorerContent={
                    <Tabs
                        ns="res"
                        tabs={[
                            {
                                title: 'Resources',
                                content: <ResourcesPanel />,
                            },
                            {
                                title: 'Three',
                                content: <ThreePanel />,
                            },
                            {
                                title: 'R3Viz',
                                content: <RapierThreeVizPanel />,
                            },
                        ]}
                    />
                }
            >
                <Game />
            </Inspector>
        </WorldContext>
    )
}
