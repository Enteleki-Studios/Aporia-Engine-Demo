import { useEffect, useState } from 'react'
import {
    AdditiveBlending,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshNormalMaterial,
    MeshStandardMaterial,
} from 'three'

import { type TypedUseWorld, useWorld } from '@core/react'

import { Option, Select, Stack } from '@inspector'
import { ThreeWorld } from '@pluginThree'

import { ThreeInfoPanel } from './threeInfoPanel'

const useThreeWorld: TypedUseWorld<ThreeWorld> = useWorld

const OVERRIDE_MATERIALS = [
    ['None', null],
    ['Normals', new MeshNormalMaterial()],
    [
        'Wireframe',
        new MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
        }),
    ],
    [
        'Normals + WF',
        new MeshNormalMaterial({
            wireframe: true,
        }),
    ],
    ['Depth', new MeshDepthMaterial()],
    [
        'Overdraw',
        new MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.05,
            depthWrite: false,
            blending: AdditiveBlending,
        }),
    ],
    [
        'Lighting',
        new MeshStandardMaterial({
            color: 0xffffff,
            map: null,
        }),
    ],
] as const

export const ThreePanel = () => {
    const world = useThreeWorld()

    const [omatIndex, setOmatIndex] = useState(0)

    useEffect(() => {
        const { renderer } = world.three

        const mat = OVERRIDE_MATERIALS[omatIndex]?.[1]

        if (mat) {
            renderer.setOverrideMaterial(mat)
        } else {
            renderer.setOverrideMaterial(null)
        }

        return () => {
            renderer.setOverrideMaterial(null)
        }
    }, [omatIndex, world])

    return (
        <Stack>
            <h3>Three</h3>
            <Stack direction="row">
                <ThreeInfoPanel />
                <Stack direction="row">
                    <div>
                        <Select
                            value={omatIndex}
                            onChange={(i) => {
                                setOmatIndex(i)
                            }}
                            label="Visualize"
                        >
                            {OVERRIDE_MATERIALS.map(([label], i) => (
                                <Option key={label} value={i}>
                                    {label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </Stack>
            </Stack>
        </Stack>
    )
}
