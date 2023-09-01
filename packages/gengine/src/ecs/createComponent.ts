type Component<T extends string = string> = { readonly type: T }

type ComponentCreator<T extends string> = {
    (): Component<T>
    readonly type: T
}

export const createComponent = <T extends string>(type: T): ComponentCreator<T> => {
    const creator = () => ({ type })

    creator.type = type
    creator.match = (component: Component): component is Component => component.type === type

    return creator
}

const testComponent = createComponent('test')
const tc = testComponent()
const type = tc.type

console.debug(type)
