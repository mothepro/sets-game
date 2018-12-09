import {name, version} from './package.json'
import * as React from 'react'
import { render } from 'react-dom'
import { install } from 'offline-plugin/runtime'
import App from './src/App'

render(
    <App package={`${process.env.NODE_ENV == 'development' ? 'dev-' : ''}${name}@${version}`} />,
    document.getElementById('app')
)

if (process.env.NODE_ENV == 'production')
    install()
