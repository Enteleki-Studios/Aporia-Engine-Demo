import { createComponent } from 'ecs'

type BoxSettings = {
    geometryType: 'box'
    size?: number
}

type SphereSettings = {
    geometryType: 'sphere'
    radius?: number
}

type BasicGeometryComponentSettings = (BoxSettings | SphereSettings) & {
    color?: number
}

export const basicGeometryComponent = createComponent(
    'basicGeometryComponent',
    (settings: BasicGeometryComponentSettings) => {
        const props = {
            geometryType: settings.geometryType,
            color: settings.color ?? 0xffffff,
            size: null as number | null,
            radius: null as number | null,
        }

        switch (settings.geometryType) {
            case 'box':
                props.size = settings.size ?? 1
                break
            case 'sphere':
                props.radius = settings.radius ?? 1
                break
            default:
                break
        }
        return props
    },
)
