import * as React from 'react'
import { Button, TextField, Grid, List, ListItem, ListItemText, Paper, ListSubheader, Divider, Icon } from '@material-ui/core'
import P2P, { Events } from 'p2p-lobby'
import { Props as GameProps } from './Game'
import Loading from './Loading';

interface Props {
    package: string
    onReady: (opts?: GameProps) => void
    onError?: (error: Error) => void
}

interface State {
    name: string
    loading: boolean
    online: boolean
    hasGroup: boolean
    canReadyUp: boolean // this should be an attribute in the node
    peers: [string, string][] // Map<PeerID, name>
}

export default class Menu extends React.Component<Props, State> {

    readonly state: State = {
        name: '',
        loading: false,
        online: false,
        hasGroup: true,
        canReadyUp: false,
        peers: [],
    }
    private node?: P2P<string>

    /** Create a node and bind its events to the dom */
    private startOnline = async (e: React.FormEvent) => {
        e.preventDefault()
        this.setState({loading: true})

        if (!this.node)
            this.node = new P2P(this.state.name, this.props.package, {
                allowSameBrowser: true,
                maxIdleTime: 10 * 60 * 1000,
            })

        this.node.on(Events.error, this.error)
        this.node.on(Events.groupReady, this.onReady)
        this.node.on(Events.disconnected, () => this.setState({online: false}))
        // Only update the lobby if no one is in our room
        this.node.on(Events.lobbyChange, () => !this.node!.inGroup && this.setState({peers: [...this.node!.lobbyPeers]}))
        this.node.on(Events.groupChange, () => this.setState({
            peers:      [...this.node!.groupPeers],
            hasGroup:   this.node!.inGroup,
            canReadyUp: this.node!.isLeader,
        }))

        await this.node.joinLobby()

        this.setState({
            loading: true,
            online: true,

            // clean start
            hasGroup: false,
            canReadyUp: false,
            peers: [],
        })
    }

    /** Simple error handling, tell the parent and disconnect */
    error = (err: Error, args?: { [prop: string]: any }) => {
        if (args)
            for (const prop in args)
                (err as any)[prop] = args[prop]

        if (this.props.onError)
            this.props.onError(err)

        if (this.node)
            this.node.disconnect()
    }

    /** When the room host ready's up. */
    private onReady = () => {
        this.setState({loading: true})

        let takeSet: (player: number, set: [number, number, number]) => void

        const peerIndex: { [id: string]: number } = { [this.node!['id']]: 0 }
        const names = [ this.node!.name ]

        for(const [peerId, name] of this.node!.groupPeers) {
            peerIndex[peerId] = names.length
            names.push(name)
        }

        // Bind new listeners
        this.node!.removeAllListeners()
        this.node!.on(Events.error, this.error)
        this.node!.on(Events.disconnected, () => this.error(Error('Disconnected from network. Try Refreshing.')))
        this.node!.on(Events.groupLeft, peerId => this.error(Error(`${this.node!.getPeerName(peerId)} left the game`)))

        this.node!.on(Events.data, ({peer, data}) => {
            if (peerIndex[peer] != undefined && Array.isArray(data) && data.length == 3)
                takeSet(peerIndex[peer], data as [number, number, number])
            else
                this.error(Error(`Recieved unexpected data from ${this.node!.getPeerName(peer)}.`), {data})
        })

        this.props.onReady({
            names,
            preventTakeAction: true,
            rng:           max => Math.abs(this.node!.random(true)) % max,
            players:       1 + this.node!.groupPeers.size,
            takeSet:       action => takeSet = action, // save the action to the outer scope
            onTakeAttempt: set => this.node!.broadcast(set),
        })
    }

    private joinPlayer = async (peer: string) => {
        this.setState({loading: true})
        await this.node!.joinGroup(peer)
        this.setState({
            loading: false,
            hasGroup: false,
            peers: [],
            canReadyUp: false,
        })
    }

    render = () => this.state.online
        ? this.state.peers.length == 0 // Is connected to others
            ? <Loading size={64}>Searching for other players</Loading>
            : !this.state.hasGroup // Is in main lobby vs player's room
                ? // In the lobby, looking to connect or waiting
                <Grid item container sm={6} md={4}>
                    <Paper style={{width: '100%'}}>
                        <List subheader={<ListSubheader>Join a player's group</ListSubheader>}>
                            <Divider />
                            {this.state.peers.map(([id, name]) =>
                                <ListItem
                                    key={id}
                                    button
                                    disabled={this.state.loading}
                                    onClick={() => this.joinPlayer(id)}>
                                    <ListItemText primary={name} />
                                </ListItem> )}
                        </List>
                        {this.state.loading && <Loading />}
                    </Paper>
                </Grid>
                : // In a room
                <Grid item container sm={6} md={4} justify="center">
                    <Paper style={{width: '100%'}}>
                        <List subheader={<ListSubheader>Players in group</ListSubheader>}>
                            <Divider />
                            {this.state.peers.map(([id, name]) =>
                                <ListItem key={id}>
                                    <ListItemText primary={name} />
                                </ListItem> )}
                        </List>
                    </Paper>
                    {this.state.canReadyUp &&
                        <Button
                            style={{marginTop: '2em'}} // clean these up
                            disabled={this.state.loading}
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => this.node!.readyUp()} >
                            Start Game
                            {this.state.loading && <Loading />}
                        </Button> }
                </Grid>
        : // Main Menu
        <> 
            <Grid item container justify="center" sm={6}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => this.props.onReady()} >
                    <Icon style={{margin: '.5em 1em .5em 0'}}>person_outline</Icon>
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
                        autoCorrect="off"
                        inputProps={{
                            maxLength: 50,
                            readOnly: !!this.node,
                        }}
                        style={{marginBottom: '1em'}} />
                    <br/>
                    <Button
                        disabled={this.state.loading || this.state.name.trim().length < 2}
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit" >
                            <Icon style={{margin: '.5em 1em .5em 0'}}>people_outline</Icon>
                            Play with People
                            {this.state.loading && <Loading />}
                    </Button>
                </form>
            </Grid>
        </>
}
