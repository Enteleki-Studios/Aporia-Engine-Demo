import { Stack } from '@inspector'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Divider } from './divider'

const meta = {
    title: 'Inspector/Divider',
    component: Divider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    decorators: [
        (Story) => (
            <div style={{ width: '30rem', height: '3rem' }}>
                <Story />
            </div>
        ),
    ],
}

export const Vertical: Story = {
    args: {
        direction: 'vertical',
    },
    decorators: [
        (Story) => (
            <div style={{ height: '3rem' }}>
                <Story />
            </div>
        ),
    ],
}

export const ExampleHorizontal: Story = {
    render: () => (
        <Stack>
            <span>Numerator</span>
            <Divider />
            <span>Denominator</span>
        </Stack>
    ),
}

export const ExampleVertical: Story = {
    render: () => (
        <Stack direction="row">
            <span>Left</span>
            <Divider direction="vertical" />
            <span>Right</span>
        </Stack>
    ),
}
