export default function Animation(entity, state) {
    return {
        type: 'animation',
        entity,

        state,
    }
}
