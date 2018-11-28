import * as React from 'react'
import P2P, { Events } from 'p2p-lobby'
import { Button, Grid, List, ListItem, ListItemText, Paper, ListSubheader, Divider, CircularProgress, Theme, Typography, WithStyles, createStyles, withStyles } from '@material-ui/core'
import {Props as GameProps} from './Game'
import { Selection } from './messages'

interface Props extends WithStyles<typeof styles> {
    package: string
    name: string
    onDisconnect: () => void
    onStart: (opts: GameProps) => void
    onError?: (error: Error) => void
}

interface LoadingProps extends WithStyles<typeof styles> {
    size?: number
}

interface State {
    loading: boolean // make an enum
    hasGroup: boolean
    canReadyUp: boolean
    peers: [string, string][] // Map<PeerID, name>
}

let node: P2P<string>

const styles = ({spacing}: Theme) => createStyles({
    readyBtn: {
        marginTop: spacing.unit * 2,
    },
    loadingIcon: {
        position:  'fixed',
        top:       '50%',
        left:      '50%',
        transform: 'translate(-50%, -50%)',
        '& span': {
            marginTop: spacing.unit * 2,
        },
    },

    fullWidth: { width: '100%' },
})

class Lobby extends React.PureComponent<Props, State> {

    /** When true, preserves node's listeners and doesn't leave the room */
    private preserve = false

    readonly state: State = {
        loading: true,
        hasGroup: false,
        canReadyUp: false,
        peers: [],
    }

    componentWillUnmount() {
        if (node && !this.preserve) {
            node.removeAllListeners()
            node.leave()
        }
    }

    /** Create a node and bind its events to the dom */
    componentDidMount() {
        this.preserve = false
        if(!node)
            node = new P2P(this.props.name, this.props.package, {allowSameBrowser: process.env.NODE_ENV == 'development'})
        else
            node.removeAllListeners()
        node.on(Events.error, this.error)
        node.on(Events.groupReady, this.onReady)
        node.on(Events.disconnected, this.props.onDisconnect)

        // Only update the lobby if no one is in our room
        node.on(Events.lobbyConnect, () => this.setState({loading: false}))
        // TODO: Find a player again once click back
        node.on(Events.lobbyChange,  () => !node!.inGroup && this.setState({peers: [...node!.lobbyPeers]}))

        node.on(Events.groupStart,     () => this.setState({loading: false}))
        node.on(Events.groupReadyInit, () => this.setState({loading: true}))
        node.on(Events.groupChange,    () => this.setState({
            peers:      [...node!.groupPeers],
            hasGroup:   node!.inGroup,
            canReadyUp: node!.isLeader,
        }))

        return node.joinLobby({maxIdle: 10 * 60 * 1000})
    }

    /** Simple error handling, tell the parent */
    private error = (err: Error, args?: { [prop: string]: any }) => {
        if (args)
            for (const prop in args)
                (err as any)[prop] = args[prop]

        if (this.props.onError)
            this.props.onError(err)
    }

    private handleJoinGroup = (id: string) => {
        this.setState({loading: true})
        return node!.joinGroup(id)
    }

    private handleReadyBtn = () => {
        this.setState({loading: true})
        return node.readyUp()
    }

    /** When the room host ready's up. */
    private onReady = () => {
        this.preserve = true

        // Make map of group members to player indexs and names
        const peerIndex: { [id: string]: number } = { [node!['id']]: 0 }
        const names = [ node!.name ]

        for(const [peerId, name] of node!.groupPeers) {
            peerIndex[peerId] = names.length
            names.push(name)
        }

        // Bind new listeners
        node.removeAllListeners()
        node.on(Events.error, this.error)
        node.on(Events.disconnected, () => this.error(Error('Disconnected from network.')))
        node.on(Events.groupLeft, peerId => this.error(Error(`${node!.getPeerName(peerId)} left the game`)))

        this.props.onStart({
            names,
            preventTakeAction: true,
            rng:           max => Math.abs(node!.random(true)) % max,
            players:       1 + node.groupPeers.size,
            onTakeAttempt: set => node.broadcast(new Selection(set)),
            nextTimeout: (oldTimeout: number) => oldTimeout == 0
                ? 5 * 1000               // ban for 5 seconds by default
                : oldTimeout + 5 * 1000, // increase ban individually
            
            // Where the magic happens
            takeSet: takeSet =>
                node.on(Events.data, ({peer, data}) => {
                    if (peer in peerIndex)
                        if(data instanceof Selection)
                            return takeSet(peerIndex[peer], data.selection)
                    this.error(Error(`Received unexpected data from ${node!.getPeerName(peer)}.`), {data})
                }),
        })
    }

    render = () => this.state.peers.length
        ? <Grid item container sm={6} md={4} justify="center">
            <Paper className={this.props.classes.fullWidth}>
                <List subheader={
                    <ListSubheader>
                        {this.state.hasGroup
                            ? 'Players in your group'
                            : 'Choose a player to join their group'}
                    </ListSubheader>
                }>
                    <Divider />
                    {this.state.peers.map(([id, name]) =>
                        <ListItem
                            key={id}
                            button={!this.state.hasGroup}
                            disabled={!this.state.hasGroup && this.state.loading}
                            // TODO: extract id from key instead so a new callback doesnt need to be made each render
                            onClick={this.state.hasGroup ? undefined : () => this.handleJoinGroup(id)}
                        >
                            <ListItemText primary={name} />
                        </ListItem> )}
                </List>
            </Paper>
            {this.state.canReadyUp &&
                <Button
                    className={this.props.classes.readyBtn}
                    disabled={this.state.loading}
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={this.handleReadyBtn} >
                    Start Game
                </Button> }
            {this.state.loading &&
                <div className={this.props.classes.loadingIcon}>
                    <CircularProgress size={64} />
                    <Typography variant="overline">
                        {this.state.hasGroup
                            ? 'Starting Game'
                            : 'Joining Group'}
                    </Typography>
                </div> }
        </Grid>
        : // If we don't see any peers, we must be connecting or looking
        <div className={this.props.classes.loadingIcon}>
            <CircularProgress size={64} />
            <Typography variant="overline">
                {this.state.loading
                    ? 'Connecting to Peer-to-Peer network'
                    : 'Searching for other players'}
            </Typography>
        </div>
}

export default withStyles(styles)(Lobby)
