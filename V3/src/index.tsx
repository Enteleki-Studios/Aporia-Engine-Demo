import { createRoot } from 'react-dom/client'

import { Root } from './game1'
import './root.scss'

const root = document.getElementById('root')

if (root) {
    createRoot(root).render(<Root />)
}
