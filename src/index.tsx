import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import { Root } from './demo'
import { Loading } from './loading'
import './root.scss'

const root = document.getElementById('root')

if (root) {
    createRoot(root).render(
        <Suspense fallback={<Loading />}>
            <Root />
        </Suspense>,
    )
}
