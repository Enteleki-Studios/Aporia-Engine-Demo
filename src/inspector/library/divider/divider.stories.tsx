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
            <div style={{ width: '30rem' }}>
                <Story />
            </div>
        ),
    ],
}
