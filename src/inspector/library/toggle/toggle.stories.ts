import { fn } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Toggle } from './toggle'

const meta = {
    title: 'Inspector/Toggle',
    component: Toggle,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
    args: { onChange: fn() },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        checked: false,
    },
}

export const WithLabel: Story = {
    args: {
        checked: true,
        children: 'My toggle',
    },
}
