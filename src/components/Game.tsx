import * as React from 'react'
import { Player, Game, Card, Events } from 'sets-game-engine'
import { Grid, Button, Icon, Typography, CircularProgress } from '@material-ui/core'
import Clock from './Clock'
import CardUI from './Card'

type index = number
export type SetIndexs = [index, index, index]

interface Props {
    players: number
    rng: (max: number) => number
    
    onTakeAttempt?: (selected: SetIndexs) => void
    onToggle?: (index: index) => void
}

interface State {
    cards: ReadonlyArray<Card>
    selected: index[] // indexs of the cards in state
    bans: { [playerIndex: number]: number } // how far the player has progressed on their ban
    scores: number[]
    finished: boolean
}

export default class GameUI extends React.Component<Props, State> {

    private readonly game = new Game({
        rng: this.props.rng,
        shoe: 2,
        timeout: 5 * 1000, // ban for 5 seconds by default
        nextTimeout: (oldTimeout: number) => oldTimeout + 5 * 1000 // increase ban individually
    })
    private readonly players: Player[] = []
    private mainPlayer?: Player // will be known at mount time
    private banHandles: WeakMap<Player, number> = new WeakMap

    readonly state: State = {
        cards: [],
        selected: [],
        bans: {},
        scores: (new Array(this.props.players)).fill(0),
        finished: true,
    }

    /** Defualts for single player mode */
    static defaultProps = {
        players: 1,
        rng: (max: number) => Math.floor(Math.random() * max),
    }

    componentDidMount() {
        for(let i = 0; i < this.props.players; i++) {
            let player = new Player
            this.players.push(player)
            this.game.addPlayer(player)
        }

        this.game.on(Events.start, () => this.mainPlayer = this.players[0])
        this.game.on(Events.playerBanned, this.onBan)
        this.game.on(Events.playerUnbanned, this.onUnban)
        this.game.on(Events.marketFilled, () => this.setState({cards: [...this.game.playableCards]}))
        this.game.on(Events.marketGrab, () => this.setState({scores: this.players.map(player => player.score)}))
        this.game.on(Events.finish, () => this.setState({finished: true}))

        this.game.start()
    }

    /** Main player tries to take a set */
    private takeSet = () => {
        if(this.props.onTakeAttempt)
            this.props.onTakeAttempt(this.state.selected as SetIndexs)
        else // by default main player will take it
            this.mainPlayer!.takeSet(...this.state.selected as SetIndexs)
        this.setState({selected: []})
    }

    /** Main player toggles a card */
    private toggleCard = (index: index) => {
        const { selected } = this.state
        if(selected.includes(index))
            selected.splice(selected.indexOf(index), 1)
        else
            selected.push(index)
        if(this.props.onToggle)
            this.props.onToggle(index)
        this.setState({selected})
    }

    /** When any player is banned */
    private onBan = ({player, timeout} : {player: Player, timeout: number}) => {
        // clear original timer if they are somehow banned already
        if (this.banHandles.has(player))
            clearInterval(this.banHandles.get(player))

        const index = this.players.indexOf(player),
              startTime = Date.now()

        this.setState({bans: { [index]: 1 } })

        this.banHandles.set(
            player,
            setInterval(
                () => this.state.bans[index] && // premature unban
                    this.setState({ bans: { [index]: (Date.now() - startTime) / timeout * 100 } }),
                Math.ceil(1000 / 60) // try to update every frame
            ) as unknown as number
        )
    }

    /** When any player is unbanned */
    private onUnban = (player: Player) => {
        const index = this.players.indexOf(player)
        const { bans } = this.state
        delete bans[index]
        clearInterval(this.banHandles.get(player))
        this.banHandles.delete(player)
        this.setState({bans})
    }

    render = () => !this.mainPlayer
        ? // Waiting for game to start
            <CircularProgress
            size={50}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -25,
                marginLeft: -25,
            }} />
        : this.state.finished
        ? // Game is finished. Show the winners
            <Typography>All done. <pre>{JSON.stringify(this.game.winners, null, 2)}</pre></Typography>
        : <>
            {this.state.cards.map((card, i) =>
                <CardUI
                    key={i}
                    card={card}
                    selected={this.state.selected.includes(i)}
                    toggle={() => this.toggleCard(i)}
                /> )}
            <Grid container style={{marginTop: '2em'}} justify="space-around" spacing={24}>
                <Grid item sm>
                    <Button
                        variant="contained"
                        color="primary"
                        aria-label="Take Set"
                        disabled={this.state.selected.length != 3 || !!this.state.bans[0]}
                        onClick={this.takeSet}
                        size="large"
                    >
                        <Icon style={{margin: '.5em 1em .5em 0'}}>done_outline</Icon>
                        Take Set
                        {this.state.bans[0] && // main player is banned
                            <CircularProgress
                                size={24}
                                variant="determinate"
                                color="secondary"
                                value={this.state.bans[0]}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: -12,
                                    marginLeft: -12,
                                }} />}
                    </Button>
                </Grid>
                <Grid item sm>
                    {this.props.players == 1 // solo
                        ? <Typography variant="h5">
                            {this.state.scores[0] == 0
                                ? 'You have not collected any sets yet'
                                : `You have collected ${this.state.scores[0]} set${this.state.scores[0] > 1 ? 's' : ''}`}
                        </Typography>
                        : false }
                </Grid>
                <Grid item sm>
                    <Clock />
                </Grid>
            </Grid>
        </>
}
