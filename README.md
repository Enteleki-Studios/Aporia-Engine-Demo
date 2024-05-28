# Patchwork Game Engine

An ECS-based, modular, web game engine written in Typescript

> [!WARNING]
> This project is currently under heavy development. Major breaking changes should be expected.

## Quickstart

A sample project is provided (in development). In the root directory, run:

```
npm install
npm start -w dungeon
```

Then navigate to [http://localhost:2080/](http://localhost:2080/).

## Project Layout

This project is structured as a monorepo using NPM workspaces. Games should be placed in the `/games/` directory. Reusable modules such as plugins should be placed in the `/packages/` directory. For your convenience, an empty `template` package is provided.

## Core

The `core` package provides all the building blocks to start building your game with Patchwork-GE.

## Engine

### Architecture
...

### World

The `World` instance manages the gameloop and provides easy access to entities, plugins, timing, and apis for managing your game's runtime.

```typescript
import { World } from '@gengine/core'

const world = new World()

world.start()
```

### Entity

An entity is a class instance that represents a single object in your game. An entity can be initialized outside of the world, but will not be made available to systems until it is added to the world. Empty entities can be created, but entities are given meaning via component composition.

```typescript
const cube = Entity.of(basicGeometryComponent({ geometryType: 'box' }), transform3D({ position: [0, 0.5, 0] }))

world.entities.addEntity(cube)
```

### Component

A component is a simple object that is identified by its `type` key. The only restriction on component properties is that they must be easily serializable primitives so values like functions or class instances are not allowed. Components are meant to represent a small slice of entity state such as position, health, whether or not the entity is fire, etc. Use the provided `createComponent` helper function to be guided through creating a component creator.

```typescript
const health = createComponent('health', ({ initialValue }: { initialValue: number }) => ({
    health: initialValue,
}))

const player = Entity.of(health({ initialValue: 20 }))

world.entities.addEntity(player)
```

A component creator can be used to check if any given component is of the same type as the what would be created by the component creator (inspired by [redux toolkit](https://redux-toolkit.js.org/api/createAction#actioncreatormatch)). This is done by comparing type keys so do be aware of the risk of type name collisions or other rare pitfalls.

```typescript
import { health } from './myComponents'

const unknownComponent = loadComponent()

if (health.match(unknownComponent)) {
    // Type is narrowed
    console.log(unknownComponent.health)
}
```

### System

...

### Query

...

### Plugin

...

## Plugins

### Rendering (3D)

A plugin wrapper around [three.js](https://github.com/mrdoob/three.js/) is provided to enable 3D rendering.

### Physics (3D)

A plugin wrapper around [rapier.js](https://github.com/dimforge/rapier.js/) is provided to enable 3D physics and collision detection.
