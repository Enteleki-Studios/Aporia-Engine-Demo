import { assertType, expectTypeOf, test } from 'vitest'

import { createComponent } from './createComponent'

test('can create tag components', () => {
    const TagComponent = createComponent('tag')

    expectTypeOf(TagComponent).toBeFunction()
    expectTypeOf(TagComponent.__key__).toEqualTypeOf('tag' as const)

    // @ts-expect-error This component takes no args
    assertType(TagComponent('error'))

    const tag = TagComponent()

    expectTypeOf(tag).toBeObject()
    expectTypeOf(tag.__key__).toEqualTypeOf('tag' as const)
})

test('can create component with no args', () => {
    const IsCollidingComponent = createComponent('isColliding', () => ({
        isColliding: false,
    }))

    expectTypeOf(IsCollidingComponent).toBeFunction()
    expectTypeOf(IsCollidingComponent.__key__).toEqualTypeOf('isColliding' as const)

    // @ts-expect-error This component takes no args
    assertType(IsCollidingComponent('error'))

    const component = IsCollidingComponent()

    expectTypeOf(component).toBeObject()
    expectTypeOf(component.__key__).toEqualTypeOf('isColliding' as const)
    expectTypeOf(component.isColliding).toBeBoolean()
})

test('can create component with optional args', () => {
    const Position2DComponent = createComponent(
        'position2D',
        (x?: number, y?: number) => ({
            x: x ?? 0,
            y: y ?? 0,
        }),
    )

    expectTypeOf(Position2DComponent).toBeFunction()
    expectTypeOf(Position2DComponent.__key__).toEqualTypeOf('position2D' as const)

    assertType(Position2DComponent())
    assertType(Position2DComponent(2))
    assertType(Position2DComponent(3, 4))

    // @ts-expect-error Too many params
    assertType(Position2DComponent(5, 6, 7))
    // @ts-expect-error Wrong param types
    assertType(Position2DComponent('er1', 'er2'))
    // @ts-expect-error Wrong param types
    assertType(Position2DComponent(1, 'er2'))

    const CircleComponent = createComponent(
        'circle',
        (color: string, radius?: number) => ({
            color,
            radius: radius ?? 1,
        }),
    )

    assertType(CircleComponent('red'))
    assertType(CircleComponent('blue', 3))

    // @ts-expect-error Wrong param types
    assertType(CircleComponent(3, 'yellow'))
    // @ts-expect-error Wrong param types
    assertType(CircleComponent(0xff0000, 10))
    // @ts-expect-error Wrong param types
    assertType(CircleComponent('black', 'pink'))
})

test('can create component with required args', () => {
    type RigidBodyProps = {
        type: string
    }

    const RigidBodyComponent = createComponent(
        'rigidBody',
        ({ type }: RigidBodyProps) => ({
            type,
        }),
    )

    expectTypeOf(RigidBodyComponent).toBeFunction()
    expectTypeOf(RigidBodyComponent.__key__).toEqualTypeOf('rigidBody' as const)

    // @ts-expect-error Param is required
    assertType(RigidBodyComponent())
    // @ts-expect-error Param must be object
    assertType(RigidBodyComponent(3))
    // @ts-expect-error Param must match props type
    assertType(RigidBodyComponent({}))
    // @ts-expect-error Param must match props type
    assertType(RigidBodyComponent({ type: 3 }))
    // @ts-expect-error Must have correct number of params
    assertType(RigidBodyComponent({ type: 'dynamic' }, 44))

    assertType(RigidBodyComponent({ type: 'dynamic' }))
})

test('components must be objects', () => {
    // @ts-expect-error string is not an object
    assertType(createComponent('test', () => 'tester'))
    // @ts-expect-error number is not an object
    assertType(createComponent('test', () => 3))
    // @ts-expect-error null is not an object
    assertType(createComponent('test', () => null))
    // @ts-expect-error undefined is not an object
    assertType(createComponent('test', () => undefined))

    assertType(createComponent('test', () => ({})))
})

test('component creators can be stringified', () => {
    const CatComponent = createComponent('cat')

    expectTypeOf(CatComponent.toString()).toEqualTypeOf('cat' as const)
})

test('component creators can be used to identify components', () => {
    const Position2DComponent = createComponent(
        'position2D',
        (x?: number, y?: number) => ({
            x: x ?? 0,
            y: y ?? 0,
        }),
    )

    const unknownComponent = {
        __key__: 'position2D',
        x: 2,
        y: 4,
    }

    // @ts-expect-error Component is still unknown
    assertType<ReturnType<typeof Position2DComponent>>(unknownComponent)

    if (Position2DComponent.match(unknownComponent)) {
        assertType<ReturnType<typeof Position2DComponent>>(unknownComponent)
    }
})
