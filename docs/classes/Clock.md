[**gamedev**](../README.md)

---

[gamedev](../globals.md) / Clock

# Class: Clock

Defined in:
[core/clock.ts:4](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L4)

## Constructors

### Constructor

> **new Clock**(): `Clock`

Defined in:
[core/clock.ts:43](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L43)

#### Returns

`Clock`

## Properties

### maxDelta

> **maxDelta**: `number` = `0.1`

Defined in:
[core/clock.ts:7](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L7)

Maximum value of delta to avoid giant leaps in time

---

### minDelta

> **minDelta**: `number` = `0.001`

Defined in:
[core/clock.ts:9](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L9)

Minimum value of delta to avoid division by zero

---

### clockStart

> **clockStart**: `number`

Defined in:
[core/clock.ts:17](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L17)

Time when clock was created in ms

---

### frameStart

> **frameStart**: `number`

Defined in:
[core/clock.ts:19](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L19)

Time when current frame started in ms

---

### frameEnd

> **frameEnd**: `number`

Defined in:
[core/clock.ts:21](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L21)

Time when current frame ended in ms

---

### delta

> **delta**: `number`

Defined in:
[core/clock.ts:25](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L25)

Time between the start of the last frame and the start of the current frame in
sec

---

### trueDelta

> **trueDelta**: `number` = `0`

Defined in:
[core/clock.ts:27](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L27)

Same as delta, but unclamped in sec

---

### fps

> **fps**: `number` = `0`

Defined in:
[core/clock.ts:29](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L29)

Precalculated fps

---

### frameLength

> **frameLength**: `number` = `0`

Defined in:
[core/clock.ts:31](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L31)

Time it took to perform all work in the previous frame in ms

---

### frameRemaining

> **frameRemaining**: `number` = `0`

Defined in:
[core/clock.ts:33](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L33)

Time remaining in frame budget in the previous frame in ms

---

### frames

> **frames**: `number` = `0`

Defined in:
[core/clock.ts:35](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L35)

Total number of frames recorded

---

### elapsedTime

> **elapsedTime**: `number` = `0`

Defined in:
[core/clock.ts:37](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L37)

Total time passed since clock start in sec

## Accessors

### fpsTarget

#### Get Signature

> **get** **fpsTarget**(): `number`

Defined in:
[core/clock.ts:56](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L56)

Target fps used to calculate frameRemaining

##### Returns

`number`

#### Set Signature

> **set** **fpsTarget**(`target`): `void`

Defined in:
[core/clock.ts:50](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L50)

##### Parameters

###### target

`number`

##### Returns

`void`

---

### frameBudget

#### Get Signature

> **get** **frameBudget**(): `number`

Defined in:
[core/clock.ts:61](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L61)

Frame length target in ms. Updated when fpsTarget is set

##### Returns

`number`

## Methods

### startFrame()

> **startFrame**(): `void`

Defined in:
[core/clock.ts:66](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L66)

Mark the start of a new frame

#### Returns

`void`

---

### endFrame()

> **endFrame**(): `void`

Defined in:
[core/clock.ts:75](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L75)

Mark the end of all work that needed to be done this frame

#### Returns

`void`

---

### now()

> `static` **now**(): `number`

Defined in:
[core/clock.ts:39](https://github.com/mikeymaxdb/GameDev/blob/c1f80a442160ac854553563c0d74e8092f409ef4/src/core/clock.ts#L39)

#### Returns

`number`
