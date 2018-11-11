import * as React from 'react'
import { Card as MaterialCard, CardContent, Grid, colors, withStyles, Typography } from '@material-ui/core'
import { Card, Details } from 'sets-game-engine'

interface Props {
    card: Card
    classes: any
    selected: boolean
    toggle?: () => void
}

// TODO merge similar styles: https://github.com/cssinjs/jss-nested
const styles = (theme: any) => ({
    card: {
        height: '10em',
        width: '20em',
        textAlign: 'center',
        padding: '1.5em 0',
        '&:hover': {
            cursor: 'pointer',
        }
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
        <Grid item container md={4} sm={6} xs={12} justify="center">
            <MaterialCard onClick={this.props.toggle} raised={this.props.selected} className={this.props.classes.card}>
                <CardContent style={{height: '100%'}}>
                    {[...Array(1 + this.props.card.quantity)].map((_, i) => {
                        const Shape = CardUI.SHAPES[this.props.card.shape]
                        return <Shape
                            key={i}
                            size={3}
                            color={CardUI.COLORS[this.props.card.color]}
                            opacity={this.props.card.opacity / 2}
                            classes={this.props.classes as any}
                        /> })}
                </CardContent>
            </MaterialCard>
        </Grid>
}

export default withStyles(styles as any)(CardUI)
