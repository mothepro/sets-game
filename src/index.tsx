import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button } from '@material-ui/core'

const App = () =>
    <Button variant="contained" color="primary">
      Hello World
    </Button>

ReactDOM.render(<App />, document.getElementById('app'))
