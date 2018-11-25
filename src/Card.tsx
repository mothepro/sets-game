import * as React from 'react'
import { Circle, Square, Triangle } from './shapes'
import { Card, Details } from 'sets-game-engine'
import { withWidth, Paper, Icon, WithStyles, withStyles, createStyles, colors, Theme } from '@material-ui/core'
import { isWidthUp, WithWidth } from '@material-ui/core/withWidth'

interface Props extends WithStyles<typeof styles>, WithWidth {
    card: Card
    selected: boolean
    toggle?: () => void
    hint?: boolean
}

const SHAPES = {
    [Details.Shape.TRIANGLE]: Triangle,
    [Details.Shape.SQUARE]:   Square,
    [Details.Shape.CIRCLE]:   Circle,
}

/**
 * HSL for some nice material colors
 * TODO: make easy to see for colorblind
 */
const COLORS = {
    [Details.Color.BLUE]: {
        hue: 207,
        saturation: 90,
        lightness: 58,
    },
    [Details.Color.GREEN]: {
        hue: 122,
        saturation: 39,
        lightness: 49,
    },
    [Details.Color.RED]: {
        hue: 4,
        saturation: 90,
        lightness: 58,
    },
}

const styles = ({spacing}: Theme) => createStyles({
    card: {
        position: 'relative',
        width: '100%',
        maxWidth: '20em',
        cursor: 'pointer',
        paddingTop: spacing.unit * 4,
        paddingBottom: spacing.unit * 4,
    },
    hint: {
        position: 'absolute',
        top: spacing.unit,
        right: spacing.unit,
        color: colors.yellow[500],
    },
})

const CardUI = ({card, selected, toggle, hint = false, width, classes}: Props) =>
    <Paper
        onClick={toggle}
        elevation={selected ? 24 : 2} // Slowly increment for nice animation?
        className={classes.card} >
        {hint && <Icon className={classes.hint}>star</Icon>}
        {[...Array(1 + card.quantity)].map((_, i) => {
            const Shape = SHAPES[card.shape]
            return <Shape
                key={i}
                size={1 +
                    +isWidthUp('sm', width) +
                    +isWidthUp('md', width) +
                    +isWidthUp('lg', width)}
                color={COLORS[card.color]}
                opacity={card.opacity / 2}
            /> })}
    </Paper>

export default withStyles(styles)(withWidth()(CardUI))
