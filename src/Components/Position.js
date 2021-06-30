export default function Position(entity, position, quaternion) {
    return {
        type: 'position',
        entity,

        position,
        quaternion,

        _needsUpdate: true,
    }
}
