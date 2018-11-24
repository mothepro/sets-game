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

const styles = ({palette, spacing, shape}: Theme) => createStyles({
    shape: {
        marginLeft: spacing.unit,
        marginRight: spacing.unit,
        display: 'inline-block',
        borderStyle: 'solid',
        borderColor: 'transparent',
        '&.square': {
            borderRadius: shape.borderRadius,
        },
        '&.circle': {
            borderRadius: '50%',
        },
        '&.triangle': {
            position: 'relative',
            width: 0,
            '& span': {
                position: 'absolute',
                borderStyle: 'solid',
                borderColor: 'transparent',
                borderBottomColor: palette.background.paper,
            },
        },
    },
})

// Equilateral Triangle Ratio. Thanks Amima :)
const baseByHeight = Math.sqrt(3) / 3

const formatColor = ({hue, saturation, lightness}: Color, opacity = 1) =>
    `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`

const TriangleComponent = ({size, color, opacity, classes}: Props) =>
    <div className={'triangle ' + classes.shape} style={{
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

const Shape = (type: 'square' | 'circle') =>
    ({size, color, opacity, classes}: Props) =>
        <div className={`${type} ${classes.shape}`} style={{
            width:          `${size}em`,
            height:         `${size}em`,
            borderWidth:    `${size / 6}em`,
            borderColor:     formatColor(color),
            backgroundColor: formatColor(color, opacity),
        }} />

export const
    Circle = withStyles(styles)(Shape('circle')),
    Square = withStyles(styles)(Shape('square')),
    Triangle = withStyles(styles)(TriangleComponent)
