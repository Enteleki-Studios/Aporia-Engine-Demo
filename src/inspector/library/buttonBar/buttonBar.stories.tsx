/* eslint-disable react/jsx-key -- No need for keys in this story */
import { Button } from '@inspector'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ButtonBar } from './buttonBar'

const meta = {
    title: 'Inspector/ButtonBar',
    component: ButtonBar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        spacing: {
            control: {
                type: 'range',
                max: 10,
            },
        },
        children: { control: false },
    },
} satisfies Meta<typeof ButtonBar>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        children: [
            <Button>Button One</Button>,
            <Button>Button Two</Button>,
            <Button>Button Three</Button>,
        ],
    },
}
/* eslint-enable react/jsx-key -- No need for keys in this story */
