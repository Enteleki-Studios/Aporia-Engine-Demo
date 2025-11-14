import { assertType, expectTypeOf, test } from 'vitest'

import { createComponent } from '@core'

import { Entities, Entity, createQuery } from '.'

const ComponentA = createComponent('componentA')

const queryA = createQuery([ComponentA])

test('result components are a proper tuple type', () => {
    const entities = new Entities()

    entities.addComponents(entities.createEntity(), ComponentA())

    const results = entities.query(queryA)

    results.forEach(([components, entity]) => {
        expectTypeOf(entity).toEqualTypeOf<Entity>()

        expectTypeOf(components[0]).toEqualTypeOf<ReturnType<typeof ComponentA>>()

        // @ts-expect-error This tuple should only have one element
        assertType(components[1])
    })
})

test('query observers receive properly typed results', () => {
    const entities = new Entities()

    entities.addQueryObserver(queryA, ([components, entity]) => {
        expectTypeOf(entity).toEqualTypeOf<Entity>()

        expectTypeOf(components[0]).toEqualTypeOf<ReturnType<typeof ComponentA>>()

        // @ts-expect-error This tuple should only have one element
        assertType(components[1])
    })
})
