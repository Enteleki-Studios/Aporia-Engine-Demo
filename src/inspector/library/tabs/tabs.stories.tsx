import { Button, Checkbox, Stack } from '@inspector'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs } from './tabs'

const meta = {
    title: 'Inspector/Tabs',
    component: Tabs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        ns: {
            control: 'text',
            description: 'namespace',
        },
    },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    decorators: [
        (Story) => (
            <div style={{ width: '30rem' }}>
                <Story />
            </div>
        ),
    ],
    args: {
        ns: 'tabs-1',
        tabs: [
            {
                title: 'Debug helpers',
                content: (
                    <Stack spacing={2}>
                        <Checkbox checked switch>
                            Render debug helpers
                        </Checkbox>
                        <Checkbox switch>Enable follow camera</Checkbox>
                        <Button>Reset debug camera position</Button>
                    </Stack>
                ),
            },
            {
                title: 'Resources',
                content: (
                    <Stack spacing={2}>
                        <span>Resource usage: 42%</span>
                        <Button>Run garbage collection</Button>
                    </Stack>
                ),
            },
        ],
    },
}
