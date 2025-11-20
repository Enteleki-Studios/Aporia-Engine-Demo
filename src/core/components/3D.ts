import { type Array3, type Quat, type Shape3D, createComponent } from '@core'

type Transform3D = {
    position: Array3
    rotation: Quat
    scale: Array3
}

export const Transform3DComponent = createComponent(
    'transform3D',
    (props?: Partial<Transform3D>): Transform3D => ({
        position: props?.position ?? [0, 0, 0],
        rotation: props?.rotation ?? [0, 0, 0, 1],
        scale: props?.scale ?? [1, 1, 1],
    }),
)

export const Geometry3DComponent = createComponent(
    'Geometry',
    (props: Shape3D): Shape3D => ({
        ...props,
    }),
)

export const Velocity3DComponent = createComponent('velocity', (velocity?: Array3) => ({
    velocity: velocity ?? [0, 0, 0],
}))
