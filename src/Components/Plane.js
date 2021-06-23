export default function Plane(
    entity,
    {
        width,
        height,
        color,
        position,
    },
) {
    return {
        type: 'plane',
        entity,

        width,
        height,
        color,
        position,
    }
}
