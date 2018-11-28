import * as React from 'react'
import P2P, { Events } from 'p2p-lobby'
import { Button, Grid, List, ListItem, ListItemText, Paper, ListSubheader, Divider, CircularProgress, Theme, Typography, WithStyles } from '@material-ui/core'
import { CircularProgressProps } from '@material-ui/core/CircularProgress'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import {CardOption, Props as GameProps} from './Game'
import { Selection } from './messages'

interface Props {
    package: string
    name: string
    onDisconnect: () => void
    onStart: (opts: GameProps) => void
    onError?: (error: Error) => void
}

interface State {
    loading: boolean // make an enum
    hasGroup: boolean
    canReadyUp: boolean
    peers: [string, string][] // Map<PeerID, name>
}

let node: P2P<string>

const styles = ({spacing}: Theme) => createStyles({
    loading: {
        position:  'fixed',
        top:       '50%',
        left:      '50%',
        transform: 'translate(-50%, -50%)',
        '& span': {
            marginTop: spacing.unit * 2,
        },
    },
})


interface LoadingProps extends WithStyles<typeof styles> {
    size?: number
}

/** Simple Loading Component that accepts text as well. */
const Loading = withStyles(styles)(
    ({classes, children, size = 24, ...props}: CircularProgressProps & LoadingProps) =>
        <div className={classes.loading}>
            <CircularProgress {...props} size={size} />
            {typeof children == 'string'
                ? <Typography variant="overline">{children}</Typography>
                : children }
        </div>
)

export default class Lobby extends React.PureComponent<Props, State> {

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

        // This is the action to grab a set for a player on the local game
        let takeSet: (player: number, set: CardOption) => void

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
        node.on(Events.data, ({peer, data}) => { // where the magic happens
            if (peer in peerIndex)
                if(data instanceof Selection)
                    return takeSet(peerIndex[peer], data.selection)
            this.error(Error(`Received unexpected data from ${node!.getPeerName(peer)}.`), {data})
        })

        this.props.onStart({
            names,
            preventTakeAction: true,
            rng:           max => Math.abs(node!.random(true)) % max,
            players:       1 + node!.groupPeers.size,
            takeSet:       action => takeSet = action, // save the action to the outer scope
            onTakeAttempt: set => node.broadcast(new Selection(set)),
            nextTimeout: (oldTimeout: number) => oldTimeout == 0
                ? 5 * 1000              // ban for 5 seconds by default
                : oldTimeout + 5 * 1000 // increase ban individually
        })
    }

    render = () => this.state.peers.length
        ? <Grid item container sm={6} md={4} justify="center">
            <Paper style={{width: '100%'}}>
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
            {this.state.canReadyUp
                ? <Button
                    style={{marginTop: '2em'}} // clean these up
                    disabled={this.state.loading}
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={this.handleReadyBtn} >
                    Start Game
                    {this.state.loading && <Loading />}
                </Button>
                : this.state.loading &&
                <Loading size={64}>
                    {this.state.hasGroup
                        ? 'Starting Game'
                        : 'Joining Group'}
                </Loading> }
        </Grid>
        : // If we don't see any peers, we must be connecting or looking
        <Loading size={64}>
            {this.state.loading
                ? 'Connecting to Peer-to-Peer network'
                : 'Searching for other players'}
        </Loading>
}
