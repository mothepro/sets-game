import * as React from 'react'
import { Typography, Button } from '@material-ui/core';

interface State {
    start: Date
    current: Date
    show: boolean
    handle?: number
}

function dateDifference(start: Date, end: Date): string {
    const diff = (end.getTime() - start.getTime()) / 1000 // don't care about ms
    return `${Math.floor(diff / 60).toString().padStart(2, '0')}:${Math.floor(diff % 60).toString().padStart(2, '0')}`
}

export default class extends React.PureComponent<{}, State> {
    
    state: State = {
        start: new Date,
        current: new Date,
        show: false
    }

    componentWillUnmount = () => clearInterval(this.state.handle!)

    componentWillMount = () => this.setState({
        handle: setInterval(() => this.setState({current: new Date}), 1000) as unknown as number // node vs browser
    })

    render = () => <>
        {this.state.show
            ? <Typography variant="h4">{dateDifference(this.state.start, this.state.current)}</Typography>
            : <Button variant="contained" onClick={() => this.setState({show: true})}>Show Timer</Button> }
    </>
}
