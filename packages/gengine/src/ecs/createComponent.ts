type SerializablePrimitives = string | number | boolean

type InputProps = {
    [K: string]: undefined | null | SerializablePrimitives | SerializablePrimitives[] | InputProps
}

type ComponentProps = {
    [K: string]: null | SerializablePrimitives | SerializablePrimitives[] | ComponentProps
}

export type Component<T extends string = string, P = ComponentProps> = { readonly type: T } & P

export type ComponentCreator<T extends string = string, I extends InputProps = InputProps, P extends ComponentProps = ComponentProps> = {
    (input: I): Component<T, P>
    readonly type: T
    match(component: Component<string, unknown>): component is Component<T, P>
}

export const createComponent = <T extends string, I extends InputProps, P extends ComponentProps>(
    type: T,
    prepareComponent: (input: I) => P,
): ComponentCreator<T, I, P> => {
    const componentCreator = (args: I) => ({
        type,
        ...prepareComponent(args),
    })

    componentCreator.type = type
    componentCreator.match = (component: Component<string, unknown>): component is Component<T, P> =>
        component.type === type

    return componentCreator
}

// Tests
// const testComponent1 = createComponent('test1', (props: { name?: string }) => ({
//     name: props?.name ?? 'default',
// }))

// const tc12 = testComponent1({})
// const tc13 = testComponent1({ name: 'tt' })
// const tc11 = testComponent1() // fail
// const tc14 = testComponent1({ name: 22 }) // fail
// const tc15 = testComponent1({ na: 'tt' }) // fail

// const tc16 = {
//     type: 'test1',
//     debug: 'matchTest',
// }
// if (testComponent1.match(tc16)) {
//     console.debug(tc16)
// }

// console.debug(JSON.stringify({ tc11, tc12, tc13, tc14, tc15 }))
