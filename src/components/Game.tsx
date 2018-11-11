import * as React from 'react'
import { Player, Game, Card, Events } from 'sets-game-engine'
import { Grid, Button, Icon, Typography } from '@material-ui/core'
import Clock from './Clock'
import CardUI from './Card'

export type SetIndexs = [number, number, number]

interface Props {
    rng?: (max: number) => number
    players?: Player[]
    
    onTakeAttempt?: (selected: SetIndexs) => void
    onToggle?: (index: number) => void
    onEvent?: <K extends Events, V extends typeof Events[K]>(event: K, arg: V) => void
}

interface State {
    selected: number[]
    cards: ReadonlyArray<Card>
}

export default class GameUI extends React.Component<Props, State> {
    private game = new Game({
        rng: this.props.rng,
        shoe: 2,
    })

    state: State = {
        selected: [],
        cards: [],
    }

    /** Defualts for single player mode */
    protected static defaultProps = { 
        players:       [new Player],
        rng:           (max: number) => Math.floor(Math.random() * max),
        onTakeAttempt: (set: SetIndexs) => GameUI.defaultProps.players[0].takeSet(...set),
    }

    componentDidMount() {
        for(const player of this.props.players!)
            this.game.addPlayer(player)
        if(this.props.onEvent)
            for(const event of this.game.eventNames())
                this.game.on(event as any, (arg: any) => this.props.onEvent!(event as any, arg))
        this.game.start()
        this.setState({cards: this.game.playableCards})
    }

    private takeSet = () => {
        if(this.props.onTakeAttempt)
            this.props.onTakeAttempt(this.state.selected as SetIndexs)
        this.setState({selected: []})
    }

    private toggleCard = (index: number) => {
        const { selected } = this.state
        if(selected.includes(index))
            selected.splice(selected.indexOf(index), 1)
        else
            selected.push(index)
        if(this.props.onToggle)
            this.props.onToggle(index)
        this.setState({selected})
    }

    render = () => <>
            {this.game.playableCards.map((card, i) =>
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
                        disabled={this.state.selected.length != 3}
                        onClick={this.takeSet}
                        size="large"
                    >
                        <Icon style={{margin: '.5em 1em .5em 0'}}>done_outline</Icon>
                        Take Set
                    </Button>
                </Grid>
                <Grid item sm>
                    {this.props.players!.length == 1
                        ? <Typography variant="h5">
                            {this.props.players![0].score == 0
                                ? 'You have not collected any sets yet.' 
                                : `You have collected ${this.props.players![0].score} set${this.props.players![0].score > 1 ? 's' : ''}.`}
                        </Typography>
                        : false }
                </Grid>
                <Grid item sm>
                    <Clock />
                </Grid>
            </Grid>
        </>
}
