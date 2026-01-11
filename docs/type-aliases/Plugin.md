[**gamedev**](../README.md)

---

[gamedev](../globals.md) / Plugin

# Type Alias: Plugin\<ProvidesResources, RequiresResources\>

> **Plugin**\<`ProvidesResources`, `RequiresResources`\> = `object`

Defined in:
[core/index.ts:21](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/index.ts#L21)

## Type Parameters

### ProvidesResources

`ProvidesResources` _extends_ `object`

### RequiresResources

`RequiresResources` _extends_ `object` = `object`

## Methods

### createResources()?

> `optional` **createResources**(): `ProvidesResources` \|
> `Promise`\<`ProvidesResources`\>

Defined in:
[core/index.ts:25](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/index.ts#L25)

#### Returns

`ProvidesResources` \| `Promise`\<`ProvidesResources`\>

---

### init()?

> `optional` **init**\<`R`\>(`world`): `void`

Defined in:
[core/index.ts:26](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/index.ts#L26)

#### Type Parameters

##### R

`R` _extends_ \{ \[KeyType in string \| number \| symbol\]: (RequiresResources &
ProvidesResources)\[KeyType\] \}

#### Parameters

##### world

[`Runtime`](../classes/Runtime.md)\<`R`\>

#### Returns

`void`
