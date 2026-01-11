import { fn } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button'

const meta = {
    title: 'Inspector/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        children: 'Button',
    },
}
