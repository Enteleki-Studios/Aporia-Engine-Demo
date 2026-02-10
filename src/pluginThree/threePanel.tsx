import { useEffect, useState } from 'react'
import {
    AdditiveBlending,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshNormalMaterial,
    MeshStandardMaterial,
} from 'three'

import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import { Option, Select, Stack } from '@inspector'
import { ThreeWorld } from '@pluginThree'

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
    // TODO: use observers in the entities class instead of
    // refreshing every frame
    useIntervalRender(100)
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
        <Stack direction="row">
            <Stack>
                <h3>Three</h3>
                <pre>Calls: {world.three.renderer.renderer.info.render.calls}</pre>
                <pre>Tris: {world.three.renderer.renderer.info.render.triangles}</pre>
                <pre>Textures: {world.three.renderer.renderer.info.memory.textures}</pre>
                <pre>
                    Geometries: {world.three.renderer.renderer.info.memory.geometries}
                </pre>
                <pre>Programs: {world.three.renderer.renderer.info.programs?.length}</pre>
            </Stack>
            <Stack direction="row">
                <p>Visualize:</p>
                <div>
                    <Select
                        value={omatIndex}
                        onChange={(i) => {
                            setOmatIndex(i)
                        }}
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
    )
}
