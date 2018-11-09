import {name, version} from '../package.json'
import * as React from 'react'
import { render } from 'react-dom'
import App from './components/App'

render(
    <App package={`${name}@${version}`} />,
    document.getElementById('app')
)

interface HotNodeModule extends NodeModule {
    hot?: {
        accept: () => void
    }
}

declare let module: HotNodeModule

if (module.hot && process.env.NODE_ENV == 'development')
    module.hot.accept()
