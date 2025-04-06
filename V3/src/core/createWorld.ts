type WorldConfig<T extends readonly Plugin<string, unknown>[]> = {
  plugins: T;
}

type World<T extends readonly Plugin<string, unknown>[]> = {
  plugins: PluginResults<T>;
}

export type Plugin<N extends string, T> = {
  name: N;
  initialize: (world: World<any>) => T;
}

export function createPlugin<N extends string, T>(
  name: N,
  initializer: () => (world: World<any>) => T
): () => Plugin<N, T>

export function createPlugin<N extends string, T, S>(
  name: N,
  initializer: (settings: S) => (world: World<any>) => T
): (settings: S) => Plugin<N, T>

export function createPlugin<N extends string, T, S>(
  name: N,
  initializer: (settings?: S) => (world: World<any>) => T
): (settings?: S) => Plugin<N, T> {
  return (settings?: S) => ({
    name,
    initialize: initializer(settings)
  });
}

type PluginResults<T extends readonly Plugin<string, unknown>[]> = {
  [P in T[number] as P['name']]: ReturnType<P['initialize']>
}

export const createWorld = <T extends readonly Plugin<string, unknown>[]>(config: WorldConfig<T>): World<T> => {
  const result: Record<string, unknown> = {}
  
  for (const plugin of config.plugins) {
    result[plugin.name] = plugin.initialize({ plugins: []})
  }
  
  return {
    plugins: result as PluginResults<T>
  };
}


const pluginA = createPlugin('plugA', () => () => ({ resource: 'water' }))
const pluginB = createPlugin('plugB', () => (world: World<any>) => ({ damage: 'fire' }))
const pluginC = createPlugin('plugC', () => () => { /**/ })
const pluginD = createPlugin('plugD', ({ testSetting }: { testSetting: string }) => () => ({ testSetting }))

const world = createWorld({ plugins: [pluginA(), pluginB(), pluginC(), pluginD({ testSetting: 'heyy' })] as const })

console.log('test')
console.log(world.plugins.plugA.resource)
console.log(world.plugins.plugB.damage)
console.log(world.plugins.plugC)
console.log(world.plugins.plugD)
