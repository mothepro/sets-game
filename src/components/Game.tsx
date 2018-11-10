import * as React from 'react'
import { Player, Game, Card } from 'sets-game-engine'
import { Grid, Button, Icon, Typography } from '@material-ui/core'
import Clock from './Clock'
import CardUI from './Card'

interface Props {
    rng: (max: number) => number
    players: Player[]
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

    componentDidMount() {
        for(const player of this.props.players)
            this.game.addPlayer(player)
        this.game.start()
        this.setState({cards: this.game.playableCards})
    }

    private takeSet = () => {
        const { selected } = this.state
        this.props.players[0].takeSet(...selected as [number, number, number])
        this.setState({selected: []})
    }

    private toggleCard = (index: number) => {
        const { selected } = this.state
        if(selected.includes(index))
            selected.splice(selected.indexOf(index), 1)
        else
            selected.push(index)
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
            <Grid container style={{marginTop: '2em'}}>
                <Grid item container xs={4} justify="center">
                    {this.props.players.length == 1
                        ? <Typography>
                            {this.props.players[0].score == 0
                                ? 'You have not collected any sets yet.' 
                                : `You have collected ${this.props.players[0].score} set${this.props.players[0].score > 1 ? 's' : ''}.`}
                        </Typography>
                        : false }
                </Grid>
                <Grid item container xs={4} justify="center"><Clock /></Grid>
                <Grid item container xs={4} justify="center">
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
            </Grid>
        </>
}
