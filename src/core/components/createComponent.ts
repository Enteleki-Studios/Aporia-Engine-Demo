/* eslint-disable @typescript-eslint/no-explicit-any -- Required */
import { Simplify } from 'type-fest'

export type ComponentKey = string
export type AnyComponent = { __key__: string }
export type AnyComponentCreator = {
    (...args: any[]): AnyComponent
    readonly __key__: string
}

export type Component<K, P> = P extends void
    ? { __key__: K }
    : Simplify<{ __key__: K } & P>

type ComponentCreator<K extends ComponentKey, I extends any[], P> = {
    (...args: I): Component<K, P>
    readonly __key__: K
    match(component: Component<string, unknown>): component is Component<K, P>
    toString: () => K
}

export function createComponent<K extends ComponentKey>(
    key: K,
): ComponentCreator<K, void[], void>
export function createComponent<
    K extends ComponentKey,
    P extends object,
    I extends any[],
>(key: K, prepareComponent: (...args: I) => P): ComponentCreator<K, I, P>
export function createComponent<
    K extends ComponentKey,
    P extends object,
    I extends any[],
>(key: K, prepareComponent?: (...args: I) => P): ComponentCreator<K, I, P> {
    const componentCreator = (...args: I) => ({
        __key__: key,
        ...prepareComponent?.(...args),
    })

    componentCreator.__key__ = key
    componentCreator.match = (
        component: Component<string, unknown>,
    ): component is Component<K, P> => component.__key__ === key
    componentCreator.toString = () => key

    // @ts-expect-error TODO: Not sure how to fix this yet
    return componentCreator
}
/* eslint-enable @typescript-eslint/no-explicit-any -- Required */
