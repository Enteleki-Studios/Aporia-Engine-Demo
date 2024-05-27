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
