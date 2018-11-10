import * as React from 'react'
import { Button, Typography, TextField, Grid } from '@material-ui/core'
import { Player } from 'sets-game-engine'

interface Props {
    package: string
    onReady: (players: Player[]) => void
}

interface State {
    name: string
}

export default class Menu extends React.Component<Props, State> {

    state: State = {
        name: ''
    }

    startSolo = () => {
        this.props.onReady([new Player])
    }

    render() {
        return <>
            <Grid item container justify="center" sm={6}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={this.startSolo} >
                    Play Solo
                </Button>
            </Grid>
            <Grid item container justify="center" sm={6}>
                <TextField
                    label="Name"
                    value={this.state.name}
                    onChange={event => this.setState({name: event.target.value})}
                    variant="outlined" />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={this.state.name.trim().length < 2} >
                    Play with People
                </Button>
            </Grid>
        </>
    }
}
