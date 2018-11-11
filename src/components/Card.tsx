import * as React from 'react'
import { Card as MaterialCard, CardContent, Grid, colors, withStyles, withWidth } from '@material-ui/core'
import { Card, Details } from 'sets-game-engine'
import { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

interface Props {
    card: Card
    classes: any
    selected: boolean
    toggle?: () => void

    width: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
}

// TODO merge similar styles: https://github.com/cssinjs/jss-nested
const styles = (theme: any) => ({
    card: {
        // height: '10em',
        maxWidth: '20em',
        width: '100%',
        '&:hover': {
            cursor: 'pointer',
        }
    },
    square: {
        margin: '.5em',
        display: 'inline-block',
        borderStyle: 'solid',
        overflow: 'hidden',
        
        borderRadius: '0.25em',
    },
    circle: {
        margin: '.5em',
        display: 'inline-block',
        borderStyle: 'solid',
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
    <div className={classes.square} style={{
        borderColor: color,
        borderWidth: Math.floor((size / 6) * 16), // round to nearest pixel
    }}>
        <div style={{
            width: `${size}em`,
            height: `${size}em`,
            backgroundColor: color,
            opacity,
        }} />
    </div>

const Triangle = ({size = 1, color = 'black', opacity = 1, classes = {} as any}) => {
    const borderWidth = .5, //size / 6,
          baseByHeight = Math.sqrt(3) / 3

    return <div className={classes.triangle} style={{
        borderBottomColor: color,

        // Equalateral triangle. Thanks Amima :)
        borderBottomWidth: `${ size + borderWidth }em`,
        borderRightWidth:  `${(size + borderWidth) * baseByHeight}em`,
        borderLeftWidth:   `${(size + borderWidth) * baseByHeight}em`,
    }}>
        <span className={classes.triangleInner} style={{
            opacity: 1 - opacity,
            left:              `${-(size - borderWidth) * baseByHeight}em`,
            borderBottomWidth: `${  size - borderWidth }em`,
            borderRightWidth:  `${ (size - borderWidth) * baseByHeight}em`,
            borderLeftWidth:   `${ (size - borderWidth) * baseByHeight}em`,
        }} />
    </div>
}

const Circle = ({size = 1, color = 'black', opacity = 1, classes = {} as any}) =>
    <div className={classes.circle} style={{
        borderColor: color,
        borderWidth: Math.floor((size / 6) * 16), // round to nearest pixel
    }}>
        <div style={{
            width:  `${size}em`,
            height: `${size}em`,
            backgroundColor: color,
            opacity,
        }} />
    </div>

class CardUI extends React.PureComponent<Props> {

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

    render = () =>
        <Grid item container sm={4} xs={6} justify="center">
            <MaterialCard
                onClick={this.props.toggle}
                raised={this.props.selected}
                className={this.props.classes.card}
                style={{padding: '1em 0'}}
            >
                <CardContent style={{height: '100%', padding: isWidthDown('xs', this.props.width) ? 0 : undefined}}>
                    {[...Array(1 + this.props.card.quantity)].map((_, i) => {
                        const Shape = CardUI.SHAPES[this.props.card.shape]
                        return <Shape
                            key={i}
                            size={1 + +isWidthUp('sm', this.props.width) + +isWidthUp('md', this.props.width)}
                            color={CardUI.COLORS[this.props.card.color]}
                            opacity={this.props.card.opacity / 2}
                            classes={this.props.classes as any}
                        /> })}
                </CardContent>
            </MaterialCard>
        </Grid>
}

export default withStyles(styles as any)(withWidth()(CardUI))
