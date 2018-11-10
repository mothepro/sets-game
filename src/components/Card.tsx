import * as React from 'react'
import { Card as MaterialCard, CardContent, Grid, colors, withStyles, Typography } from '@material-ui/core'
import { Card, Details } from 'sets-game-engine'

interface Props {
    card: Card
    onSelect?: Function
    onUnselect?: Function
}

interface State {
    selected: boolean
}

const CardColor = 'white'

const Square = ({size = 1, color = 'black', opacity = 1}) =>
    <div style={{
        border: `0.5em solid ${color}`,
        borderRadius: '0.25em',
        display: 'inline-block',
        overflow: 'hidden',
        margin: '.5em',
    }}>
        <div style={{
            width: `${size}em`,
            height: `${size}em`,
            backgroundColor: color,
            opacity,
        }} />
    </div>

const Triangle = ({size = 1, color = 'black', opacity = 1}) =>
    <div style={{
        position: 'relative',
        display: 'inline-block',
        margin: '.5em',

        width: 0,
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderBottomColor: color,

        // Equalateral triangle. Thanks Amima :)
        borderBottomWidth: `${ size + 0.5 }em`,
        borderRightWidth:  `${(size + 0.5) * Math.sqrt(3) / 3}em`,
        borderLeftWidth:   `${(size + 0.5) * Math.sqrt(3) / 3}em`,
    }}>
        <span style={{
            position: 'absolute',
            opacity: 1 - opacity,
            top: '.5em',
            left: `${-(size - 0.5) * Math.sqrt(3) / 3}em`,

            width: 0,
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderBottomColor: CardColor,

            borderBottomWidth: `${ size - 0.5 }em`,
            borderRightWidth:  `${(size - 0.5) * Math.sqrt(3) / 3}em`,
            borderLeftWidth:   `${(size - 0.5) * Math.sqrt(3) / 3}em`,
        }} />
    </div>

const Circle = ({size = 1, color = 'black', opacity = 1}) =>
    <div style={{
        border: `0.5em solid ${color}`,
        borderRadius: '50%',
        display: 'inline-block',
        overflow: 'hidden',
        margin: '.5em',
    }}>
        <div style={{
            width: `${size}em`,
            height: `${size}em`,
            backgroundColor: color,
            opacity,
        }} />
    </div>

export default class CardUI extends React.PureComponent<Props, State> {

    private static readonly SHAPES = {
        [Details.Shape.TRIANGLE]: Triangle,
        [Details.Shape.SQUARE]:   Square,
        [Details.Shape.CIRCLE]:   Circle,
    }

    private static readonly COLORS = {
        [Details.Color.BLUE]:  colors.blue[500],
        [Details.Color.GREEN]: colors.green[500],
        [Details.Color.RED]:   colors.red[500],
    }

    public state = {
        selected: false,
    }

    toggle = () => {
        if (this.state.selected && this.props.onUnselect)
            this.props.onUnselect()

        if (!this.state.selected && this.props.onSelect)
            this.props.onSelect()

        this.setState({selected: !this.state.selected})
    }

    render = () =>
        <Grid item xs={4}>
            <MaterialCard onClick={this.toggle} raised={this.state.selected} style={{height: '100%'}}>
                <CardContent style={{
                    textAlign: 'center',
                    minHeight: '3em',
                }}>
                    {[...Array(1 + this.props.card.quantity)].map((_, i) => {
                        const Shape = CardUI.SHAPES[this.props.card.shape]
                        return <Shape
                            key={i}
                            size={3}
                            color={CardUI.COLORS[this.props.card.color]}
                            opacity={this.props.card.opacity / 2}
                        />
                    })}
                </CardContent>
            </MaterialCard>
        </Grid>
}
