[**gamedev**](../README.md)

---

[gamedev](../globals.md) / ObjectStore

# Class: ObjectStore\<K, V\>

Defined in:
[core/objectStore.ts:2](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/objectStore.ts#L2)

## Extends

- `Map`\<`K`, `V`\>

## Type Parameters

### K

`K`

### V

`V`

## Constructors

### Constructor

> **new ObjectStore**\<`K`, `V`\>(`initializer`): `ObjectStore`\<`K`, `V`\>

Defined in:
[core/objectStore.ts:5](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/objectStore.ts#L5)

#### Parameters

##### initializer

(`key`) => `V`

#### Returns

`ObjectStore`\<`K`, `V`\>

#### Overrides

`Map<K, V>.constructor`

## Methods

### create()

> **create**(`key`): `V`

Defined in:
[core/objectStore.ts:10](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/objectStore.ts#L10)

#### Parameters

##### key

`K`

#### Returns

`V`

---

### getOrCreate()

> **getOrCreate**(`key`): \[`V`, `boolean`\]

Defined in:
[core/objectStore.ts:18](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/objectStore.ts#L18)

#### Parameters

##### key

`K`

#### Returns

\[`V`, `boolean`\]
