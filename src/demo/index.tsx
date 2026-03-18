import { use } from 'react'

import { ResourcesPanel, WorldContext } from '@core/react'

import { Divider, Inspector, Stack, Tabs } from '@inspector'
import { CubeIcon, EyeIcon, PuzzlePieceIcon, SunHorizonIcon } from '@phosphor-icons/react'
import { ClockPanel } from '@pluginClock'
import { EntitiesPanel } from '@pluginEntities'
import { RapierThreeVizPanel } from '@pluginRapierThreeViz'
import { RuntimePanel } from '@pluginRuntime'
import { SkyPanel } from '@pluginSky'
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
                    <Stack fullWidth>
                        <ClockPanel />
                        <Divider />
                        <RuntimePanel />
                        <Divider />
                        <EntitiesPanel />
                    </Stack>
                }
                explorerContent={
                    <Tabs
                        ns="res"
                        tabs={[
                            {
                                title: 'Resources',
                                icon: <PuzzlePieceIcon />,
                                content: <ResourcesPanel />,
                            },
                            {
                                title: 'Three',
                                icon: <CubeIcon />,
                                content: <ThreePanel />,
                            },
                            {
                                title: 'R3Viz',
                                icon: <EyeIcon />,
                                content: <RapierThreeVizPanel />,
                            },
                            {
                                title: 'Sky',
                                icon: <SunHorizonIcon />,
                                content: <SkyPanel />,
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
