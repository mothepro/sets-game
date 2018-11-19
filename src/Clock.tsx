import * as React from 'react'
import { Typography, Icon, IconButton } from '@material-ui/core';

interface State {
    start: Date
    current: Date
    handle?: number
}

function dateDifference(start: Date, end: Date): string {
    const diff = (end.getTime() - start.getTime()) / 1000 // don't care about ms

    const hours = Math.floor(diff / 60 ** 2),
        minutes = Math.floor(diff / 60) % 60,
        seconds = Math.floor(diff % 60)

    return `${hours > 0 ? hours + ':' : ''
        }${hours > 0 ? minutes.toString().padStart(2, '0') : minutes
        }:${seconds.toString().padStart(2, '0')}`
}

export default class extends React.PureComponent<{}, State> {
    
    readonly state: State = {
        start: new Date,
        current: new Date,
    }

    componentWillUnmount() {
        if (this.state.handle)
            clearInterval(this.state.handle!)
    }

    private handleShow = () =>
        this.setState({
            handle: setInterval(
                () => this.setState({current: new Date}),
                1000 / 2) as unknown as number, // node vs browser
            current: new Date, // sync clock asap
        })

    private handleHide = () => {
        clearInterval(this.state.handle)
        this.setState({handle: undefined})
    }

    render = () =>
        <>
            <IconButton onClick={!!this.state.handle ? this.handleHide : this.handleShow}>
                <Icon>{!!this.state.handle ? 'timer_off' : 'timer'}</Icon>
            </IconButton>
            {!!this.state.handle &&
                <Typography variant="overline" style={{fontSize: '2em'}} >
                    {dateDifference(this.state.start, this.state.current)}
                </Typography> }
        </>
}
