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
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        children: 'Button',
    },
}

export const Disabled: Story = {
    args: {
        children: 'Button',
        disabled: true,
    },
}
