import type { Meta, StoryObj } from '@storybook/react-vite'

import { Range } from './range'

const meta = {
    title: 'Inspector/Range',
    component: Range,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof Range>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        value: 35,
        min: 0,
        max: 90,
        children: 'Elevation',
    },
}
