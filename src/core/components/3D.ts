import { type Array3, type Quat, createComponent } from '@core'

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

type BasicGeometry =
    | {
          type: 'box'
          width: number
          length: number
          height: number
      }
    | {
          type: 'sphere'
          radius: number
      }

export const BasicGeometryComponent = createComponent(
    'basicGeometry',
    (props: BasicGeometry): BasicGeometry => ({
        ...props,
    }),
)

export const MeshComponent = createComponent('mesh')

export const Velocity3DComponent = createComponent('velocity', (velocity?: Array3) => ({
    velocity: velocity ?? [0, 0, 0],
}))
