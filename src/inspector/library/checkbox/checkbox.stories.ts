import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from './checkbox'

const meta = {
    title: 'Inspector/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        defaultChecked: true,
        children: 'Enable Inspector',
    },
}

export const Switch: Story = {
    args: {
        defaultChecked: true,
        children: 'Enable Inspector',
        switch: true,
    },
}
