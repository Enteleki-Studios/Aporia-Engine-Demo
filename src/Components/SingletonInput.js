export default function SingletonInput(entity) {
    return {
        type: 'singletonInput',
        entity,

        forward: false,
        run: false,

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
