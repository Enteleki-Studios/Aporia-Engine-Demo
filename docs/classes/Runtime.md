[**gamedev**](../README.md)

---

[gamedev](../globals.md) / Runtime

# Class: Runtime\<R\>

Defined in:
[core/runtime.ts:3](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L3)

## Type Parameters

### R

`R` _extends_ `object`

## Constructors

### Constructor

> **new Runtime**\<`R`\>(`resources`): `Runtime`\<`R`\>

Defined in:
[core/runtime.ts:13](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L13)

#### Parameters

##### resources

`R`

#### Returns

`Runtime`\<`R`\>

## Properties

### clock

> **clock**: [`Clock`](Clock.md)

Defined in:
[core/runtime.ts:4](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L4)

---

### resources

> **resources**: `R`

Defined in:
[core/runtime.ts:5](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L5)

---

### syncFrames

> **syncFrames**: `boolean` = `true`

Defined in:
[core/runtime.ts:7](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L7)

## Accessors

### isRunning

#### Get Signature

> **get** **isRunning**(): `boolean`

Defined in:
[core/runtime.ts:79](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L79)

##### Returns

`boolean`

## Methods

### addSystem()

> **addSystem**(`system`): `void`

Defined in:
[core/runtime.ts:25](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L25)

#### Parameters

##### system

[`AnySystem`](../type-aliases/AnySystem.md)

#### Returns

`void`

---

### removeSystem()

> **removeSystem**(`system`): `void`

Defined in:
[core/runtime.ts:30](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L30)

#### Parameters

##### system

[`AnySystem`](../type-aliases/AnySystem.md)

#### Returns

`void`

---

### addDebugSystem()

> **addDebugSystem**(`system`): `void`

Defined in:
[core/runtime.ts:38](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L38)

#### Parameters

##### system

[`AnySystem`](../type-aliases/AnySystem.md)

#### Returns

`void`

---

### removeDebugSystem()

> **removeDebugSystem**(`system`): `void`

Defined in:
[core/runtime.ts:42](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L42)

#### Parameters

##### system

[`AnySystem`](../type-aliases/AnySystem.md)

#### Returns

`void`

---

### start()

> **start**(): `void`

Defined in:
[core/runtime.ts:50](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L50)

#### Returns

`void`

---

### stop()

> **stop**(): `void`

Defined in:
[core/runtime.ts:54](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L54)

#### Returns

`void`

---

### step()

> **step**(): `void`

Defined in:
[core/runtime.ts:65](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/runtime.ts#L65)

#### Returns

`void`
