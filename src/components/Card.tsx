import * as React from 'react'
import { Card as MaterialCard, CardContent, Grid, colors, withStyles, Typography } from '@material-ui/core'
import { Card, Details } from 'sets-game-engine'

interface Props {
    card: Card
    classes: any
    onSelect?: Function
    onUnselect?: Function
}

interface State {
    selected: boolean
}

// TODO merge similar styles
const styles = (theme: any) => ({
    card: {
        height: '100%',
        width: '100%',
    },
    square: {
        margin: '.5em',
        display: 'inline-block',
        borderStyle: 'solid',
        borderWidth: '0.5em',
        overflow: 'hidden',
        
        borderRadius: '0.25em',
    },
    circle: {
        margin: '.5em',
        display: 'inline-block',
        borderStyle: 'solid',
        borderWidth: '0.5em',
        overflow: 'hidden',
        
        borderRadius: '50%',
    },
    triangle: {
        position: 'relative',
        display: 'inline-block',
        margin: '.5em',

        width: 0,
        borderStyle: 'solid',
        borderColor: 'transparent',
    },
    triangleInner: {
        position: 'absolute',
        top: '.5em',

        width: 0,
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderBottomColor: theme.palette.background.paper,
    }
})

const Square = ({size = 1, color = 'black', opacity = 1, classes = {} as any}) =>
    <div style={{borderColor: color}} className={classes.square}>
        <div style={{
            width: `${size}em`,
            height: `${size}em`,
            backgroundColor: color,
            opacity,
        }} />
    </div>

const Triangle = ({size = 1, color = 'black', opacity = 1, classes = {} as any}) =>
    <div className={classes.triangle} style={{
        borderBottomColor: color,

        // Equalateral triangle. Thanks Amima :)
        borderBottomWidth: `${ size + 0.5 }em`,
        borderRightWidth:  `${(size + 0.5) * Math.sqrt(3) / 3}em`,
        borderLeftWidth:   `${(size + 0.5) * Math.sqrt(3) / 3}em`,
    }}>
        <span className={classes.triangleInner} style={{
            opacity: 1 - opacity,
            left:              `${-(size - 0.5) * Math.sqrt(3) / 3}em`,
            borderBottomWidth: `${ size - 0.5 }em`,
            borderRightWidth:  `${(size - 0.5) * Math.sqrt(3) / 3}em`,
            borderLeftWidth:   `${(size - 0.5) * Math.sqrt(3) / 3}em`,
        }} />
    </div>

const Circle = ({size = 1, color = 'black', opacity = 1, classes = {} as any}) =>
    <div style={{borderColor: color}} className={classes.circle}>
        <div style={{
            width: `${size}em`,
            height: `${size}em`,
            backgroundColor: color,
            opacity,
        }} />
    </div>

class CardUI extends React.PureComponent<Props, State> {

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
        <Grid item sm={4} xs={12}>
            <MaterialCard onClick={this.toggle} raised={this.state.selected} className={this.props.classes.card}>
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
                            classes={this.props.classes as any}
                        />
                    })}
                </CardContent>
            </MaterialCard>
        </Grid>
}

export default withStyles(styles as any)(CardUI)
