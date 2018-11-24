import * as React from 'react'
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core'

interface Color {
    hue: number
    saturation: number
    lightness: number
}

interface Props extends WithStyles<typeof styles> {
    size: number
    opacity: number
    color: Color
}

const styles = ({palette, spacing}: Theme) => createStyles({
    shape: {
        marginLeft: spacing.unit * 2,
        marginRight: spacing.unit * 2,
        display: 'inline-block',
        borderStyle: 'solid',
        borderColor: 'transparent',
        position: 'relative',
        width: 0,
        '& span': { // for triangles
            width: 0,
            position: 'absolute',
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderBottomColor: palette.background.paper,
        },
    },
})

// Equilateral Triangle Ratio. Thanks Amima :)
const baseByHeight = Math.sqrt(3) / 3

const formatColor = ({hue, saturation, lightness}: Color, opacity = 1) =>
    `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`

const TriangleComponent = ({size, color, opacity, classes}: Props) =>
    <div className={classes.shape} style={{
                borderBottomColor: formatColor(color),
                borderBottomWidth: `${size}em`,
                borderRightWidth:  `${size * baseByHeight}em`,
                borderLeftWidth:   `${size * baseByHeight}em`,
            }}>
        <span style={{
            opacity:           1 - opacity,
            top:               `${size / 6}em`, // actual border width
            left:              `${-(size - size / 3) * baseByHeight}em`,
            borderBottomWidth: `${ (size - size / 3) }em`,
            borderRightWidth:  `${ (size - size / 3) * baseByHeight}em`,
            borderLeftWidth:   `${ (size - size / 3) * baseByHeight}em`,
        }} />
    </div>

const SquareComponent = ({size, color, opacity, classes}: Props) =>
    <div className={classes.shape} style={{
        width:          `${size}em`,
        height:         `${size}em`,
        borderWidth:    `${size / 6}em`,
        borderColor:     formatColor(color),
        backgroundColor: formatColor(color, opacity),

        borderRadius: '0.1em',
    }} />

const CircleComponent = ({size, color, opacity, classes}: Props) =>
    <div className={classes.shape} style={{
        width:          `${size}em`,
        height:         `${size}em`,
        borderWidth:    `${size / 6}em`,
        borderColor:     formatColor(color),
        backgroundColor: formatColor(color, opacity),

        borderRadius: '50%',
    }} />

export const
    Circle = withStyles(styles)(CircleComponent),
    Square = withStyles(styles)(SquareComponent),
    Triangle = withStyles(styles)(TriangleComponent)
