[**gamedev**](../README.md)

---

[gamedev](../globals.md) / createComponent

# Function: createComponent()

## Call Signature

> **createComponent**\<`K`\>(`key`): `ComponentCreator`\<`K`, `void`[], `void`\>

Defined in:
[core/components/createComponent.ts:22](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/components/createComponent.ts#L22)

### Type Parameters

#### K

`K` _extends_ `string`

### Parameters

#### key

`K`

### Returns

`ComponentCreator`\<`K`, `void`[], `void`\>

## Call Signature

> **createComponent**\<`K`, `P`, `I`\>(`key`, `prepareComponent`):
> `ComponentCreator`\<`K`, `I`, `P`\>

Defined in:
[core/components/createComponent.ts:25](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/components/createComponent.ts#L25)

### Type Parameters

#### K

`K` _extends_ `string`

#### P

`P` _extends_ `object`

#### I

`I` _extends_ `any`[]

### Parameters

#### key

`K`

#### prepareComponent

(...`args`) => `P`

### Returns

`ComponentCreator`\<`K`, `I`, `P`\>
