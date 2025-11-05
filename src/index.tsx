import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import { Root } from './game1'
import './root.scss'

const root = document.getElementById('root')

const Loading = () => <div>Loading....</div>

if (root) {
    createRoot(root).render(
        <Suspense fallback={<Loading />}>
            <Root />
        </Suspense>,
    )
}
