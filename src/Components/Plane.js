export default function Plane(entity, params) {
    return {
        type: 'plane',
        entity,
        ...params,
    }
}
