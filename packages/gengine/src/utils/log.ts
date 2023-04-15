/* eslint-disable no-console */

let logLevel = 5

type Logger = {
    e: typeof console.error
    w: typeof console.warn
    i: typeof console.info
    l: typeof console.log
    d: typeof console.debug
    setLogLevel: (level: number) => void
}

export const log: Logger = {
    e: (m) => logLevel > 0 && console.error(m),
    w: (m) => logLevel > 1 && console.warn(m),
    i: (m) => logLevel > 2 && console.info(m),
    l: (m) => logLevel > 3 && console.log(m),
    d: (m) => logLevel > 4 && console.log(m),
    setLogLevel: (level) => logLevel = level
}
