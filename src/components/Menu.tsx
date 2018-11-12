import * as React from 'react'
import { Button, TextField, Grid, CircularProgress } from '@material-ui/core'
import P2P, { Events } from 'p2p-lobby'

export interface ReadyOpts {
    players: number
    rng: (max: number) => number
    onTake: (set: [number, number, number]) => void
}

interface Props {
    package: string
    onReady: (opts?: ReadyOpts) => void
    onError?: (error: Error) => void
}

interface State {
    name: string
    loading: boolean
    online: boolean
    peers: [string, string][],
}

export default class Menu extends React.Component<Props, State> {

    state: State = {
        name: '',
        loading: false,
        online: false,
        peers: [],
    }

    private node?: P2P<string>

    private startOnline = async (e: React.FormEvent) => {
        if(this.canPlayOnline) {
            e.preventDefault()
            this.setState({loading: true})

            this.node = new P2P(this.state.name, this.props.package, {allowSameBrowser: true})
            this.node.on(Events.error, (err: Error) => this.props.onError && this.props.onError(err))
            this.node.on(Events.peerChange, this.updatePeers)
            await this.node.joinLobby()

            this.setState({loading: false, online: true})
        }
    }

    private get canPlayOnline() {
        return !this.state.loading && this.state.name.trim().length >= 2
    }

    private updatePeers = () => setTimeout(()=>this.setState({peers: [...this.node!.peers]}), 0)

    render() {
        return this.state.online
        ? // Online Lobby
        <pre style={{textAlign: 'left'}}>{JSON.stringify(this.state, null, 2)}</pre>
        : // Main Menu
        <> 
            <Grid item container justify="center" sm={6}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => this.props.onReady()} >
                    Play Solo
                </Button>
            </Grid>
            <Grid item container justify="center" sm={6}>
                <form onSubmit={this.startOnline} noValidate autoComplete="off">
                    <TextField
                        label="Name"
                        value={this.state.name}
                        onChange={event => this.setState({name: event.target.value})}
                        variant="outlined"
                        style={{marginBottom: '1em'}} />
                    <br/>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        disabled={!this.canPlayOnline} >
                            Play with People
                            {this.state.loading &&
                                <CircularProgress
                                    size={24}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: -12,
                                        marginLeft: -12,
                                    }} />}
                    </Button>
                </form>
            </Grid>
        </>
    }
}
