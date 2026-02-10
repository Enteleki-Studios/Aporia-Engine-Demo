/* eslint-disable react/jsx-key -- No need for keys in this story */
import { Button, Divider, Toggle } from '@inspector'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Stack } from './stack'

const meta = {
    title: 'Inspector/Stack',
    component: Stack,
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
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        children: [
            <Toggle
                checked
                onChange={() => {
                    /**/
                }}
            >
                Render 3D
            </Toggle>,
            <Divider />,
            <span>FPS: 120</span>,
            <Divider />,
            <Button>Submit</Button>,
        ],
    },
}

/* eslint-enable react/jsx-key -- No need for keys in this story */
