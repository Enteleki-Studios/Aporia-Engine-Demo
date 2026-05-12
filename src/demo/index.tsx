import { use } from 'react'

import { ResourcesPanel, WorldContext } from '@enteleki-studios/aporia-engine-core/react'
import { Divider, Inspector, Stack, Tabs } from '@inspector'
import {
    CubeIcon,
    EyeIcon,
    PuzzlePieceIcon,
    SunHorizonIcon,
    TerminalIcon,
} from '@phosphor-icons/react'
import { ClockPanel } from '@pluginClock'
import { ConsolePanel } from '@pluginConsole'
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
                    <Stack direction="row" fullWidth>
                        <Tabs
                            ns="exp1"
                            style={{ flex: 1 }}
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
                        <Tabs
                            ns="exp2"
                            style={{ flex: 1 }}
                            tabs={[
                                {
                                    title: 'Console',
                                    icon: <TerminalIcon />,
                                    content: <ConsolePanel />,
                                },
                            ]}
                        />
                    </Stack>
                }
            >
                <Game />
            </Inspector>
        </WorldContext>
    )
}
