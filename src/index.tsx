import {name, version} from '../package.json'
import * as React from 'react'
import { render } from 'react-dom'
import App from './components/App'

render(
    <App package={`${name}@${version}`} />,
    document.getElementById('app')
)
