import { use } from 'react'

import { ResourcesPanel, RuntimePanel, WorldContext } from '@core/react'

import { Divider, Inspector, Stack, Tabs } from '@inspector'
import { EntitiesPanel } from '@pluginEntities'
import { RapierThreeVizPanel } from '@pluginRapierThreeViz'
import { ThreePanel } from '@pluginThree'

import { game1 } from './engineDef'
import { Game } from './game'
import './index.scss'

const worldPromise = game1()

export const Root = () => {
    const world = use(worldPromise)

    return (
        <WorldContext value={world}>
            <Inspector
                sidepanelContent={
                    <Stack divider={<Divider />}>
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
