import { useEffect, useState, useSyncExternalStore } from 'react'
import {
    AdditiveBlending,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshNormalMaterial,
    MeshStandardMaterial,
} from 'three'

import { Checkbox, Divider, Option, Select, Stack } from '@inspector'

import { useThreeWorld } from '.'
import { ThreeInfoPanel } from './threeInfoPanel'

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
    [
        'Vertex colors',
        new MeshBasicMaterial({
            vertexColors: true,
        }),
    ],
] as const

export const ThreePanel = () => {
    const world = useThreeWorld()
    const { helperStore } = world.three

    const helperCollections = useSyncExternalStore(
        helperStore.subscribe,
        helperStore.collections,
    )

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
            <Stack direction="row" spacing={4}>
                <ThreeInfoPanel />
                <Divider direction="vertical" />
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
                <Divider direction="vertical" />
                <Stack>
                    <p>Helpers</p>
                    {helperCollections.map((collection) => (
                        <Checkbox
                            key={collection.type}
                            checked={collection.visible}
                            onChange={(isChecked) => {
                                helperStore.toggleHelpers(collection.type, isChecked)
                            }}
                        >
                            {`${collection.type} (${collection.helpers.length})`}
                        </Checkbox>
                    ))}
                </Stack>
            </Stack>
        </Stack>
    )
}

// UV checker
// const tex = new THREE.TextureLoader().load('/uv_checker.png')
// tex.wrapS = tex.wrapT = THREE.RepeatWrapping
// scene.overrideMaterial = new THREE.MeshBasicMaterial({
//   map: tex
// })

// Object color
// const mat = new THREE.MeshBasicMaterial()
// scene.traverse((o) => {
//   if ((o as THREE.Mesh).isMesh) {
//     const mesh = o as THREE.Mesh
//     const color = new THREE.Color(Math.random(), Math.random(), Math.random())
//     mesh.material = mat.clone()
//     ;(mesh.material as THREE.MeshBasicMaterial).color = color
//   }
// })
