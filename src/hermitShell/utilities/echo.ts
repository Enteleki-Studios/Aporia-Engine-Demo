import { Utility } from '@hermitShell'

export const echo: Utility = ['echo', (args: string[]) => args[1]]
