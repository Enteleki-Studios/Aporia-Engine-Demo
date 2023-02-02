import type { Store } from '@reduxjs/toolkit'

import { appendLog, type LogLine } from './slice'

export const logger = (store: Store) => (logLine: LogLine) => store.dispatch(appendLog(logLine))
