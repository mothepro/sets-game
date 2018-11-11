import * as React from 'react'
import { Typography, Button, Icon, Grid, IconButton } from '@material-ui/core';

interface State {
    start: Date
    current: Date
    handle?: number
}

function dateDifference(start: Date, end: Date): string {
    const diff = (end.getTime() - start.getTime()) / 1000 // don't care about ms
    return `${Math.floor(diff / 60).toString()}:${Math.floor(diff % 60).toString().padStart(2, '0')}`
}

export default class extends React.PureComponent<{}, State> {
    
    state: State = {
        start: new Date,
        current: new Date,
    }

    componentWillUnmount = () => this.state.handle && clearInterval(this.state.handle!)

    render = () => !!this.state.handle
            ?
            <>
                <IconButton onClick={() => {
                    clearInterval(this.state.handle)
                    this.setState({handle: undefined})
                    }}>
                    <Icon>timer_off</Icon>
                </IconButton>
                <Typography
                    variant="overline"
                    style={{fontSize: '2em'}} >
                    {dateDifference(this.state.start, this.state.current)}
                </Typography>
            </>
            :
            <IconButton onClick={() => 
                this.setState({
                    handle: setInterval(() => this.setState({current: new Date}), 1000 / 2) as unknown as number, // node vs browser
                    current: new Date, // sync clock asap
                })}>
                <Icon>timer</Icon>
            </IconButton>
}
