export default function Animation(entity, state) {
    return {
        type: 'animation',
        entity,
        _needsUpdate: true,
        _prevState: null,

        state,
    }
}
