/* eslint-disable react/jsx-key -- No need for keys in this story */
import { useState } from 'react'

import { Option } from '@inspector'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select } from './select'

const meta = {
    title: 'Inspector/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: false },
    },
    args: {
        children: [
            <Option value={null}>Null option</Option>,
            <Option value={0}>Option 0</Option>,
            <Option value={1}>Option 1</Option>,
            <Option value={2}>Option 2 (longer)</Option>,
        ],
    },
    decorators: [
        (Story) => (
            <div style={{ height: '8rem' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        value: 1,
    },
}

export const Open: Story = {
    args: {
        defaultOpen: true,
        value: 1,
    },
}

const SelectWithHooks = () => {
    type Value = 0 | 1 | 2 | null
    const [value, setValue] = useState<Value>(null)

    return (
        <Select
            value={value}
            onChange={(v) => {
                setValue(v)
            }}
        >
            <Option value={null}>Null option</Option>
            <Option value={0}>Option 0</Option>
            <Option value={1}>Option 1</Option>
            <Option value={2}>Option 2</Option>
        </Select>
    )
}

export const ChangeHandler: Story = {
    args: {
        value: null,
    },
    render: () => <SelectWithHooks />,
}

/* eslint-enable react/jsx-key -- No need for keys in this story */
