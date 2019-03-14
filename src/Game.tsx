import * as React from 'react'
import Clock from './Clock'
import CardUI from './Card'
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
    IconButton,
    Hidden,
    withStyles,
    withWidth,
    createStyles,
    Theme,
    WithStyles,
    CircularProgress,
} from '@material-ui/core'
import { isWidthUp, WithWidth } from '@material-ui/core/withWidth'

type index = number
export type CardOption = boolean[]

export interface Props {
    // Total number of players in the game
    players: number

    // Randomize function
    rng: (max: number) => number

    // A name to match each player, should be empty or length of `player`
    names: string[]

    // If true, will not take set when button is pressed
    preventTakeAction: boolean

    // Pauses timer on focus lost
    pauseTimeOnBlur: boolean

    // How long the user should be banned. (Don't provide to disable banning)
    nextTimeout?: (oldTimeout: number) => number

    // Called when a card's selected status is changed
    onToggle?: (index: index) => void

    // Called when the main player tries to take a set
    onTakeAttempt?: (selected: CardOption) => void

    /*
    The action take a set from this game.
    This is given to parent/siblings to take sets on player's behalf.
    */
    takeSet?: (action: (player: index, set: CardOption) => boolean) => void
}

interface State {
    // how far the player has progressed on their ban
    bans: { [playerIndex: number]: number }
    scores: number[]
    finished: boolean

    // Data for displaying cards properly
    cards: Card[]
    // order for cards to appear. 0, means to remove
    enter: number[]
    selected: CardOption
    hint: CardOption
}

const transitionDelays: { [prop: string]: {transitionDelay: string} } = {}
for (let i = 0; i < 50; i++)
    transitionDelays[`enter-${i}`] = {
        transitionDelay: `${(1 - 1)* 250}ms`
    }

const styles = ({spacing}: Theme) => createStyles({
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
    leaderboard: {
        width: '100%',
    },
    loading: {
        position: 'absolute',
    },

    gutterRight: { marginRight: spacing.unit },
    gutterTop: { marginTop: spacing.unit * 4 },
    gutterBottom: { marginBottom: spacing.unit * 5 },
    // ...transitionDelays,
})

class GameUI extends React.Component<Props & WithStyles<typeof styles> & WithWidth, State> {

    private game!: Game // Will be known at mount time
    private readonly players: Player[] = []
    private readonly banHandles: WeakMap<Player, number> = new WeakMap
    private totalTime = 0
    private lastPause = new Date

    readonly state: State = {
        bans: {},
        scores: Array(this.props.players).fill(0),
        finished: false,

        cards: [],
        enter: [],
        selected: [],
        hint: [],
    }

    /** Defaults for single player mode */
    static defaultProps = {
        players: 1,
        names: [],
        pauseTimeOnBlur: true,
        preventTakeAction: false,
        rng: (max: number) => Math.floor(Math.random() * max),
    }

    private onFinish = () => {
        this.pause()
        this.setState({finished: true})
    }

    componentWillUnmount = () => {
        if (typeof removeEventListener == 'function') {
            removeEventListener('keydown', this.keybinds)
            if (this.props.pauseTimeOnBlur) {
                removeEventListener('focus', this.unpause)
                removeEventListener('blur', this.pause)
            }
        }
        this.game.removeAllListeners()
    }

    componentDidMount() {
        if (typeof addEventListener == 'function') {
            addEventListener('keydown', this.keybinds)
            if (this.props.pauseTimeOnBlur) {
                addEventListener('focus', this.unpause)
                addEventListener('blur', this.pause)
            }
        }

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

        this.game.on(Events.start, () => this.props.takeSet && this.props.takeSet(this.takeSet))
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
     * The user switches focus away.
     * Save the total time taken.
     */
    private pause = () => this.totalTime += Date.now() - this.lastPause.getTime()

    /**
     * The user returns focus.
     * Save the current time of continue.
     */
    private unpause = () => this.lastPause = new Date

    /**
     * Keyboard shortcuts.
     * + Pressing `enter` tries to take a set
     */
    private keybinds = (event: KeyboardEvent) => {
        switch(event.code) {
        case 'Enter':
        case 'NumpadEnter':
            event.preventDefault()
            this.takeSetAttempt()
            break
        }
    }

    /** Action to take a set from the deck for a player */
    private takeSet = (player: index, set: CardOption) =>
        this.players[player].takeSet(...this.state.cards.filter((_, index) => set[index]) as CardSet)

    /** Main player tries to take a set */
    private takeSetAttempt = () => {
        if (this.props.onTakeAttempt)
            this.props.onTakeAttempt(this.state.selected)
        if (!this.props.preventTakeAction)
            this.takeSet(0, this.state.selected)
        // remove selected regardless if it is successful
        this.setState({selected: Array(this.state.cards.length).fill(false)})
    }

    /** Main player toggles a card */
    private toggleCard = (index: index) => {
        const { selected } = this.state
        selected[index] = !selected[index]
        if (this.props.onToggle)
            this.props.onToggle(index)
        this.setState({selected})
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
                () => this.setState({ bans: { [index]: (Date.now() - startTime) / timeout * 100 } }),
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
            selected: Array(this.state.cards.length).fill(false),
            hint:     Array(this.state.cards.length).fill(false),
            scores:   this.players.map(player => player.score),
            enter:    this.state.enter.map((enter, index) => removedSet.includes(this.state.cards[index]) ? 0 : enter),
        })

    /** Add card to state and animate it in order. */
    private onFill = () => {
        let count = 1
        const cards = [...this.game.playableCards]

        const refillCards = () =>
            this.setState({
                cards,
                enter: cards.map((card, index) => this.state.cards[index] && this.state.cards[index].encoding == card.encoding
                    ? this.state.enter[index] // keep same if it exists
                    : count++ ),
                selected: Array(cards.length).fill(false),
                hint:     Array(cards.length).fill(false),
            })

        if (this.state.cards.length) // wait for old cards to leave
            setTimeout(refillCards, 250)
        else
            refillCards()
    }

    private giveHint = () => {
        const { hint, cards } = this.state
        const hints = this.game.hint()

        const ungivenCards = cards.filter((card, index) => hints.includes(card) && !hint[index])

        if (ungivenCards.length) {
            // index of a card
            hint[ cards.indexOf(ungivenCards[Math.floor(Math.random() * ungivenCards.length)]) ] = true
            this.setState({hint})
        }
    }

    render = () => !this.state.finished
        ? <>
            {this.state.cards.map((card, index) =>
                <CardUI
                    key={card.encoding} // should be better
                    index={index}
                    card={card}
                    selected={this.state.selected[index]}
                    hint={this.state.hint[index]}
                    enter={this.state.enter[index]}
                    onClick={this.toggleCard} /> )}
            <Grid
                item
                container
                justify="center"
                md={6} sm={8} xs={12}
                className={this.props.classes.gutterTop + ' '
                    // make space room for fixed buttons
                    + (isWidthUp('sm', this.props.width) ? '' : this.props.classes.gutterBottom)} >
                {this.props.players == 1
                    ? // Just show a sentence in solo mode
                    <Typography variant="h5">
                        {this.state.scores[0] == 0
                            ? 'You have not collected any sets yet'
                            : `You have collected ${this.state.scores[0]} set${this.state.scores[0] > 1 ? 's' : ''}`}
                    </Typography>
                    : // Leaderboard
                    <Paper className={this.props.classes.leaderboard}>
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
                                        <CircularProgress
                                            variant="determinate"
                                            color="secondary"
                                            value={this.state.bans[index]}
                                            className={this.props.classes.loading} /> }
                                </ListItem> )}
                        </List>
                    </Paper> }
            </Grid>
            <div className={this.props.classes.options}>
                <Clock />
                <IconButton
                    aria-label="Get Hint"
                    onClick={this.giveHint}
                    disabled={this.state.hint.reduce((total, hint) => total + +hint, 0) >= 3}
                >
                    <Icon>help_outline</Icon>
                </IconButton>
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
                <Icon className={isWidthUp('sm', this.props.width)
                        ? this.props.classes.gutterRight
                        : undefined}>
                    done_outline
                </Icon>
                <Hidden only="xs">Take Set</Hidden>
                {this.state.bans[0] &&
                    <CircularProgress
                        variant="determinate"
                        color="secondary"
                        value={this.state.bans[0]}
                        className={this.props.classes.loading} /> }
            </Button>
        </>
        : // TODO Show winners once game is finished.
        <Typography variant="overline">
            All done.
            {JSON.stringify(this.game.winners, null, 2)}
        </Typography>

}

export default withStyles(styles)(withWidth()(GameUI))
