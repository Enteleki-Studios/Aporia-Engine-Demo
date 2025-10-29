import { type TypedUseWorld, useWorld } from '@core/react'

import type { World } from './createWorld'

export const useGameWorld: TypedUseWorld<World> = useWorld
