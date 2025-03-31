import { createRoot } from 'react-dom/client'

import { App } from './app'
import './root.scss'
import { game1 } from './game1'

const root = document.getElementById('root')

if (root) {
    createRoot(root).render(<App />)
}

game1()
