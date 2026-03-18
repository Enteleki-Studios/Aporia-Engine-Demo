import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from './alert'

const meta = {
    title: 'Inspector/Alert',
    component: Alert,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
    args: {
        children: 'Information is available at the complementary kiosk',
        severity: 'info',
    },
}

export const Success: Story = {
    args: {
        children: 'Task failed Successfully',
        severity: 'success',
    },
}

export const Warning: Story = {
    args: {
        children: 'This is your final Warning',
        severity: 'warning',
    },
}

export const Error: Story = {
    args: {
        children: 'Error: Does not compute',
        severity: 'error',
    },
}
