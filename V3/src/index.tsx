import { createRoot } from 'react-dom/client'

import { App } from './app'
import { game1 } from './game1'
import './root.scss'

const root = document.getElementById('root')

if (root) {
    createRoot(root).render(<App />)
}

game1()
