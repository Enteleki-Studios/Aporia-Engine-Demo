/* eslint-disable react/jsx-key -- No need for keys in this story */
import type { Meta, StoryObj } from '@storybook/react-vite'

import { TBody, TCell, Table } from './table'

const meta = {
    title: 'Inspector/Table',
    component: Table,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: false },
    },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        children: [
            <TBody>
                <TCell>Geometries</TCell>
                <TCell>4242</TCell>

                <TCell>Triangles</TCell>
                <TCell>8675309</TCell>

                <TCell>Shader programs</TCell>
                <TCell>67</TCell>
            </TBody>,
        ],
    },
}

/* eslint-enable react/jsx-key -- No need for keys in this story */
