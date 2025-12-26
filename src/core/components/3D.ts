import { type Array3, type Array4, type Shape3D, createComponent } from '@core'

type Transform3D = {
    position: Array3
    rotation: Array4
}

export const Transform3DComponent = createComponent(
    'Transform3D',
    (props?: Partial<Transform3D>): Transform3D => ({
        position: props?.position ?? [0, 0, 0],
        rotation: props?.rotation ?? [0, 0, 0, 1],
    }),
)

export const Geometry3DComponent = createComponent(
    'Geometry3D',
    (props: Shape3D): Shape3D => ({
        ...props,
    }),
)

export const Velocity3DComponent = createComponent('Velocity', (velocity?: Array3) => ({
    velocity: velocity ?? [0, 0, 0],
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Used to apply Partial over a union
type Shape3DComponentDefinition<T extends Shape3D = Shape3D> = T extends any
    ? Partial<Omit<T, 'type'>> & { type: T['type'] }
    : never

export const Shape3DComponent = createComponent(
    'Shape3D',
    (definition: Shape3DComponentDefinition): Shape3D => {
        const { type } = definition

        switch (type) {
            case 'ball':
                return {
                    type,
                    radius: definition.radius ?? 0.5,
                }
            case 'box':
                return {
                    type,
                    halfWidth: definition.halfWidth ?? 0.5,
                    halfHeight: definition.halfHeight ?? 0.5,
                    halfDepth: definition.halfDepth ?? 0.5,
                }
            case 'wedge':
                return {
                    type,
                    halfWidth: definition.halfWidth ?? 0.5,
                    halfHeight: definition.halfHeight ?? 0.5,
                    halfDepth: definition.halfDepth ?? 0.5,
                }
            case 'capsule':
                return {
                    type,
                    radius: definition.radius ?? 0.5,
                    halfHeight: definition.halfHeight ?? 0.5,
                }
            case 'heightfield':
                return {
                    type,
                    ncols: definition.ncols ?? 2,
                    nrows: definition.nrows ?? 2,
                    heights: definition.heights ?? [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    scale: definition.scale ?? [1, 1, 1],
                }
        }
    },
)

export type Transform3DComponent = ReturnType<typeof Transform3DComponent>
export type Geometry3DComponent = ReturnType<typeof Geometry3DComponent>
export type Velocity3DComponent = ReturnType<typeof Velocity3DComponent>
export type Shape3DComponent = ReturnType<typeof Shape3DComponent>
