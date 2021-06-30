export default function SingletonInput(entity) {
    return {
        type: 'singletonInput',
        entity,

        upPress: false,
        upHold: false,

        leftPress: false,
        leftHold: false,

        rightPress: false,
        rightHold: false,

        downPress: false,
        downHold: false,
    }
}
