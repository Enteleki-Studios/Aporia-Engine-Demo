export * from './hermit'
export * from './utilities'

export type Utility = [string, (args: string[]) => string | undefined]
