import * as React from 'react'
import Shape from './Shape'
import { Card, Details } from 'sets-game-engine'
import { withWidth, Paper, Icon, WithStyles, withStyles, createStyles, colors, Theme, Zoom, Grid, ButtonBase } from '@material-ui/core'
import { isWidthUp, WithWidth } from '@material-ui/core/withWidth'

interface Props extends NonInteractiveProps {
    index: number
    onClick: (index: number) => void
}

interface NonInteractiveProps extends WithStyles<typeof styles>, WithWidth {
    card: Card
    selected?: boolean
    hint?: boolean
    enter?: number
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
    interactiveCard: {
        width: '100%',
        maxWidth: '20em',
    },
    card: {
        width: '100%',
        maxWidth: '20em',
        paddingTop: spacing.unit * 4,
        paddingBottom: spacing.unit * 4,
        transition: 'box-shadow 250ms',
    },
    hint: { // Annie's Idea
        position: 'absolute',
        top: spacing.unit,
        right: spacing.unit,
        color: colors.yellow[500],
    },
})

const NonInteractiveCard = ({card, selected = false, hint = false, width, classes}: NonInteractiveProps) =>
    <Paper className={classes.card} elevation={selected ? 16 : 2}>
        <Zoom in={hint} timeout={1000}>
            <Icon className={classes.hint}>star</Icon>
        </Zoom>
        {[...Array(1 + card.quantity)].map((_, i) =>
            <Shape
                key={i}
                opacity={card.opacity / 2}
                size={1 +
                    +isWidthUp('sm', width) +
                    +isWidthUp('md', width) +
                    +isWidthUp('lg', width) }
                type={{
                    [Details.Shape.CIRCLE]: 'circle' as 'circle',
                    [Details.Shape.SQUARE]: 'square' as 'square',
                    [Details.Shape.TRIANGLE]: 'triangle' as 'triangle',
                }[card.shape]}
                color={COLORS[card.color]}
            /> )}
    </Paper>

const InteractiveCard = ({index, onClick, enter = index + 1, classes, ...props}: Props) =>
    <Zoom in={!!enter} style={{transitionDelay: enter ? `${(enter - 1) * 250}ms` : undefined}}>
        <Grid item container sm={4} xs={6} justify="center">
            <ButtonBase
                focusRipple
                component="div"
                onClick={event => {
                    // If the `Enter` key was used to trigger this, ignore it since the keybind takes priority.
                    if((event as unknown as React.KeyboardEvent).nativeEvent.code == 'Enter')
                        return event.preventDefault()
                    onClick(index)
                }}
                disabled={!!index}
                className={classes.interactiveCard}>
                <NonInteractiveCard {...props} classes={classes} />
            </ButtonBase>
        </Grid>
    </Zoom>

export default withStyles(styles)(withWidth()(InteractiveCard))
