import * as React from 'react'
import Shape from './Shape'
import { Card, Details } from 'sets-game-engine'
import { withWidth, Paper, Icon, WithStyles, withStyles, createStyles, colors, Theme } from '@material-ui/core'
import { isWidthUp, WithWidth } from '@material-ui/core/withWidth'

interface Props extends WithStyles<typeof styles>, WithWidth {
    card: Card
    selected: boolean
    hint?: boolean
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
        width: '100%',
        maxWidth: '20em',
        paddingTop: spacing.unit * 4,
        paddingBottom: spacing.unit * 4,
        transition: 'box-shadow 250ms',
    },
    hint: {
        position: 'absolute',
        top: spacing.unit,
        right: spacing.unit,
        color: colors.yellow[500],
    },
})

const CardUI = ({card, selected, hint = false, width, classes}: Props) =>
    <Paper className={classes.card} elevation={selected ? 24 : 2}>
        {hint && // Annie's Idea
            <Icon className={classes.hint}>star</Icon>}
        {[...Array(1 + card.quantity)].map((_, i) => 
            <Shape
                key={i}
                color={COLORS[card.color]}
                opacity={card.opacity / 2}
                size={1 +
                    +isWidthUp('sm', width) +
                    +isWidthUp('md', width) +
                    +isWidthUp('lg', width) }
                type={card.shape == Details.Shape.CIRCLE
                    ? 'circle'
                    : card.shape == Details.Shape.TRIANGLE
                        ? 'triangle'
                        : 'square'}
            /> )}
    </Paper>

export default withStyles(styles)(withWidth()(CardUI))
