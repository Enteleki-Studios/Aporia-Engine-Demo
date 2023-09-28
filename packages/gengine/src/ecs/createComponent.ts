type Component<T extends string = string> = { readonly type: T }

type ComponentCreator<T extends string> = {
    (): Component<T>
    readonly type: T
    match(component: Component): component is Component
}

export const createComponent = <T extends string>(type: T): ComponentCreator<T> => {
    const componentCreator = () => ({ type })

    componentCreator.type = type
    componentCreator.match = (component: Component): component is Component => component.type === type

    return componentCreator
}

const testComponent = createComponent('test')
const tc = testComponent()
const type = tc.type

console.debug(type, JSON.stringify(tc))
