import * as React from 'react'
import Clock from './Clock'
import CardUI from './Card'
import Loading from './Loading'
import { Player, Game, Card, Events, CardSet } from 'sets-game-engine'
import {
    Grid,
    Button,
    Icon,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Zoom,
    IconButton,
    Hidden,
    ButtonBase,
    withStyles,
    withWidth,
    createStyles,
    Theme,
    WithStyles,
} from '@material-ui/core'
import { isWidthUp, WithWidth } from '@material-ui/core/withWidth';

type index = number
// TODO: add a packable version
type IndexSet = [index, index, index]

export interface Props {
    // Total number of players in the game
    players: number

    // Randomize function
    rng: (max: number) => number

    // A name to match each player, should be empty or length of `player`
    names: string[]

    // If true, will not take set when button is pressed
    preventTakeAction: boolean

    // How long the user should be banned. (Don't provide to disbale banning)
    nextTimeout?: (oldTimeout: number) => number

    // Called when a card's selected status is changed
    onToggle?: (index: index) => void

    // Called when the main player trys to take a set
    onTakeAttempt?: (selected: IndexSet) => void

    /*
    The action take a set from this game.
    This is given to parent/siblings to take sets on player's behalf.
    */
    takeSet?: (action: (player: index, set: IndexSet) => boolean) => void
}

interface State {
    bans: { [playerIndex: number]: number } // how far the player has progressed on their ban
    scores: number[]
    finished: boolean

    // Data for displaying cards properly
    card: Card[]
    enter: number[] // order for cards to appear. 0, means to remove
    selected: boolean[]
    hint: boolean[]
}

const transitionDelays: { [prop: string]: {transitionDelay: string} } = {}
for (let i = 0; i < 50; i++)
    transitionDelays[`enter-${i}`] = {
        transitionDelay: `${(1 - 1)* 250}ms`
    }

const styles = ({spacing}: Theme) => createStyles({
    card: {
        width: '100%',
        maxWidth: '20em',
    },
    info: {
        marginTop: spacing.unit * 4,
    },
    score: {
        float: 'right',
    },
    take: {
        position: 'fixed',
        bottom: spacing.unit * 2,
        right: spacing.unit * 2,
    },
    options: {
        position: 'fixed',
        bottom: spacing.unit * 2,
        left: spacing.unit * 2,
    },
    extendedIcon: { // spacing for extended fab
        marginRight: spacing.unit,
    },
    // ...transitionDelays,
})

class GameUI extends React.Component<Props & WithStyles<typeof styles> & WithWidth, State> {

    private banHandles: WeakMap<Player, number> = new WeakMap

    // will be known at mount time
    private game!: Game
    private readonly players: Player[] = []
    private start?: Date
    private end?: Date

    readonly state: State = {
        bans: {},
        scores: (new Array(this.props.players)).fill(0),
        finished: false,

        card: [],
        enter: [],
        selected: [],
        hint: [],
    }

    /** Defualts for single player mode */
    static defaultProps = {
        players: 1,
        preventTakeAction: false,
        names: [],
        rng: (max: number) => Math.floor(Math.random() * max),
    }

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this.keybinds)
        this.game.removeAllListeners()
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keybinds)

        // Make the game here in case our RNG method switches
        this.game = new Game({
            rng: this.props.rng,
            nextTimeout: this.props.nextTimeout,
        })
        this.players.length = 0 // clear player list

        for(let i = 0; i < this.props.players; i++) {
            let player = new Player
            this.players.push(player)
            this.game.addPlayer(player)
        }

        this.game.on(Events.start, this.onStart)
        this.game.on(Events.finish, this.onFinish)
        this.game.on(Events.playerBanned, this.onBan)
        this.game.on(Events.playerUnbanned, this.onUnban)
        this.game.on(Events.marketGrab, this.onGrab)
        this.game.on(Events.marketFilled, this.onFill)

        this.game.start()
    }

    /** Whether a set can be taken */
    private canTake = () =>
        !this.state.bans[0] && // not banned
        this.state.selected.reduce((total, selected) => total + +selected, 0) == 3  // exactly 3 cards selected

    /**
     * Add keyboard shortcuts.
     * + Pressing `enter` tries to take a set
     */
    private keybinds = (event: KeyboardEvent) => {
        if (event.keyCode == 13) { // enter
            event.preventDefault()
            this.takeSetAttempt()
        }
    }

    /** Action to take a set from the deck for a player */
    private takeSet = (player: index, set: IndexSet) => {
        this.setState({
            selected: Array(this.state.card.length).fill(false),
            hint:     Array(this.state.card.length).fill(false),
        })
        return this.players[player].takeSet(...this.state.card.filter((_, index) => set.includes(index)) as CardSet)
    }

    /** Main player tries to take a set */
    private takeSetAttempt = () => {
        if(!this.canTake())
            return false

        const selectedIndexs = this.state.selected
            .map((selected, index) => selected ? index : undefined)
            .filter(index => index != undefined) as IndexSet // clean up undefined
        if (this.props.onTakeAttempt)
            this.props.onTakeAttempt(selectedIndexs)
        if (!this.props.preventTakeAction)
            this.takeSet(0, selectedIndexs)
    }

    /** Main player toggles a card */
    private toggleCard = (index: index) => {
        const { selected } = this.state
        selected[index] = !selected[index]
        if (this.props.onToggle)
            this.props.onToggle(index)
        this.setState({selected})
    }

    private onStart = () => {
        this.start = new Date
        if (this.props.takeSet)
            this.props.takeSet(this.takeSet)
    }

    private onFinish = () => {
        this.end = new Date
        this.setState({finished: true})
    }

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

    private onUnban = (player: Player) => {
        const index = this.players.indexOf(player)
        const { bans } = this.state
        delete bans[index]
        clearInterval(this.banHandles.get(player))
        this.banHandles.delete(player)
        this.setState({bans})
    }

    /** Remove cards in place, and animate new cards in order. */
    private onGrab = (removedSet: [Card, Card, Card]) =>
        this.setState({
            scores: this.players.map(player => player.score),
            enter: this.state.enter.map((enter, index) =>
                        removedSet.includes(this.state.card[index]) ? 0 : enter),
        })

    /** Add card to state and animate it in order. */
    private onFill = () => {
        let count = 1
        const cards = [...this.game.playableCards]

        const refillCards = () =>
            this.setState({
                card: cards,
                enter: cards.map((card, index) => this.state.card[index] && this.state.card[index].encoding == card.encoding
                    ? this.state.enter[index] // keep same if it exists
                    : count++ ),
                selected: Array(cards.length).fill(false),
                hint:     Array(cards.length).fill(false),
            })

        if (this.state.card.length) // wait for old cards to leave
            setTimeout(refillCards, 250)
        else
            refillCards()
    }

    private giveHint = () => {
        const { hint, card } = this.state
        const hints = this.game.hint()

        const ungivenCards = card.filter((c, index) => hints.includes(c) && !hint[index])

        if (ungivenCards.length) {
            // index of a card
            hint[ card.indexOf(ungivenCards[Math.floor(Math.random() * ungivenCards.length)]) ] = true
            this.setState({hint})
        }
    }

    render = () => !this.state.finished
        ? <>
            {this.state.card.map((card, index) =>
                <Zoom
                    key={card.encoding}
                    in={!!this.state.enter[index]}
                    style={{transitionDelay: this.state.enter[index] ? `${(this.state.enter[index] - 1)* 250}ms` : undefined}}
                >
                    <Grid item container sm={4} xs={6} justify="center">
                        <ButtonBase
                            focusRipple
                            component="button"
                            onClick={() => this.toggleCard(index)}
                            className={this.props.classes.card}
                         >
                            <CardUI
                                card={card}
                                selected={this.state.selected[index]}
                                hint={this.state.hint[index]} />
                        </ButtonBase>
                    </Grid>
                </Zoom> )}
            {this.props.players == 1
                ? // Just show a sentence in solo mode
                <Typography variant="h5" className={this.props.classes.info}>
                    {this.state.scores[0] == 0
                        ? 'You have not collected any sets yet'
                        : `You have collected ${this.state.scores[0]} set${this.state.scores[0] > 1 ? 's' : ''}`}
                </Typography>
                : // Leaderboard
                <Paper className={this.props.classes.info}>
                    <List>
                        {this.props.names.map((name, index) =>
                            <ListItem key={index} disabled={!!this.state.bans[index]}>
                                <ListItemText>
                                    <Typography variant="overline" className={this.props.classes.score}>
                                        {this.state.scores[index]}
                                    </Typography>
                                    {name}
                                </ListItemText>
                                {this.state.bans[index] && // player is banned
                                    <Loading
                                        variant="determinate"
                                        color="secondary"
                                        value={this.state.bans[index]} />}
                            </ListItem> )}
                    </List>
                </Paper> }
            <div className={this.props.classes.options}>
                <IconButton onClick={this.giveHint} aria-label="Get Hint">
                    <Icon>help_outline</Icon>
                </IconButton>
                <Clock />
            </div>
            <Button
                variant={isWidthUp('sm', this.props.width) ? 'extendedFab' : 'fab'}
                color="primary"
                aria-label="Take Set"
                disabled={!this.canTake()}
                onClick={this.takeSetAttempt}
                size={isWidthUp('sm', this.props.width) ? 'large' : undefined}
                className={this.props.classes.take}
            >
                <Icon className={isWidthUp('sm', this.props.width) ? this.props.classes.extendedIcon : undefined}>done_outline</Icon>
                <Hidden only="xs">Take Set</Hidden>
                {this.state.bans[0] &&
                    <Loading
                        variant="determinate"
                        color="secondary"
                        value={this.state.bans[0]} /> }
            </Button>
        </>
        : // TODO Show winners once game is finished.
        <Typography variant="overline">
            All done.
            {JSON.stringify(this.game.winners, null, 2)}
        </Typography>

}

export default withStyles(styles)(withWidth()(GameUI))
