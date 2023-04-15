// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentConstructor<T extends Component> = abstract new (...args: any[]) => T

// eslint-disable-next-line @typescript-eslint/ban-types
export type AnyComponentConstructor = Function

//eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class Component {}
