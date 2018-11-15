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
    lobby: boolean
    canReadyUp: boolean // this should be an attribute in the node
    peers: [string, string][] // Map<PeerID, name>
}

export default class Menu extends React.Component<Props, State> {

    readonly state: State = {
        name: '',
        loading: false,
        online: false,
        lobby: true,
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

        this.node.on(Events.error,        this.error)
        this.node.on(Events.roomReady,    this.onReady)
        this.node.on(Events.lobbyConnect, () => this.setStateWait({peers: [...this.node!.peers], lobby: true}))
        // Go offline when disconnected
        this.node.on(Events.disconnected, () => this.setState({    peers: [], loading: false, online: false, lobby: true}))
        // Listen for changes to peer list
        this.node.on(Events.peerConnect,  () => this.setStateWait({peers: [...this.node!.peers], lobby: false, canReadyUp: false}))
        // Only update the lobby if no one is in our room
        this.node.on(Events.lobbyChange,  () => this.node!.myPeers.size == 0 && this.setStateWait({peers: [...this.node!.lobbyPeers]})) // after meleft
        // Go back to lobby if your room is empty when someone leaves
        this.node.on(Events.meLeft,       () => this.setStateWait({peers: [...this.node!.myPeers], lobby: this.node!.myPeers.size == 0}))
        this.node.on(Events.meJoin,       () => this.setState({    peers: [...this.node!.myPeers], lobby: false, canReadyUp: true}))

        await this.node.connect() // temp work around. broken in 0.0.17
        await this.node.joinLobby()

        this.setState({loading: false, online: true})
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

    /** A delayed set state to wait for peer data to update before proccessing */
    setStateWait = <K extends keyof State>(state: Pick<State, K>) => setTimeout(() => this.setState(state), 0)

    /** When the room host ready's up. */
    private onReady = () => {
        this.setState({loading: true})

        let takeSet: (player: number, set: [number, number, number]) => void
        const peerIndex: { [id: string]: number } = { [this.node!['id']]: 0 }
        const names = [ this.node!.name ]

        for(const [peerId, name] of this.state.peers) {
            peerIndex[peerId] = names.length
            names.push(name)
        }

        this.node!.removeAllListeners()
        this.node!.on(Events.error, this.error)
        this.node!.on(Events.disconnected, () => this.error(Error('Disconnected from network. Try Refreshing.')))
        this.node!.on(Events.peerLeft, peerId => this.error(Error(`${this.node!.peers.get(peerId)} left the game`)))

        this.node!.on(Events.data, ({peer, data}) => {
            if (peerIndex[peer] != undefined && Array.isArray(data) && data.length == 3)
                takeSet(peerIndex[peer], data as [number, number, number])
            else
                this.error(Error(`Recieved unexpected data from ${this.node!.peers.get(peer)}.`), {data})
        })

        this.props.onReady({
            names,
            preventTakeAction: true,
            rng:           max => Math.abs(this.node!.random(true)) % max,
            players:       1 + this.node!.peers.size,
            takeSet:       action => takeSet = action, // save the action to the outer scope
            onTakeAttempt: set => this.node!.broadcast(set),
        })
    }

    private joinPlayer = async (peer: string) => {
        this.setState({loading: true})
        await this.node!.joinPeer(peer)
        this.setState({
            loading: false,
            lobby: false,
            peers: [],
            canReadyUp: false,
        })
    }

    render = () => this.state.online
        ? this.state.peers.length == 0 // Is connected to others
            ? <Loading size={64}>Searching for other players</Loading>
            : this.state.lobby // Is in main lobby vs player's room
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
