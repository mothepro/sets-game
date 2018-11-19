import * as React from 'react'
import {createStyles, Theme, withStyles} from '@material-ui/core'

interface Color {
    hue: number
    saturation: number
    lightness: number
}

interface Props {
    size: number
    opacity: number
    color: Color
    classes: {
        shape: string
        triangle: string
    }
}

const styles = ({palette}: Theme) => createStyles({
    shape: {
        margin: '0 .5em',
        display: 'inline-block',
        borderStyle: 'solid',

        overflow: 'hidden',
    },
    triangle: {
        display: 'inline-block',
        margin: '0 .5em',
        borderStyle: 'solid',

        width: 0,
        borderColor: 'transparent',
        position: 'relative',
        '& span': {
            position: 'absolute',
            width: 0,
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderBottomColor: palette.background.paper,
        },
    },
})

const formatColor = ({hue, saturation, lightness}: Color, opacity = 1) =>
    `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`

const TriangleComponent = ({size, color, opacity, classes}: Props) => {
    const borderWidth  = size / 6,
          baseByHeight = Math.sqrt(3) / 3 // Equilateral triangle. Thanks Amima :)

    return <div className={classes.triangle} style={{
                borderBottomColor: formatColor(color),
                borderBottomWidth: `${size}em`,
                borderRightWidth:  `${size * baseByHeight}em`,
                borderLeftWidth:   `${size * baseByHeight}em`,
            }}>
        <span style={{
            opacity:           1 - opacity,
            top:               `${ borderWidth }em`,
            left:              `${-(size - borderWidth * 2) * baseByHeight}em`,
            borderBottomWidth: `${ (size - borderWidth * 2) }em`,
            borderRightWidth:  `${ (size - borderWidth * 2) * baseByHeight}em`,
            borderLeftWidth:   `${ (size - borderWidth * 2) * baseByHeight}em`,
        }} />
    </div>
}

const SquareComponent = ({size, color, opacity, classes}: Props) =>
    <div className={classes.shape} style={{
        width:          `${size}em`,
        height:         `${size}em`,
        borderWidth:    `${size / 6}em`,
        borderColor:     formatColor(color),
        backgroundColor: formatColor(color, opacity),

        borderRadius: '0.25em',
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

const Circle = withStyles(styles)(CircleComponent),
      Square = withStyles(styles)(SquareComponent),
      Triangle = withStyles(styles)(TriangleComponent)

export { Circle, Triangle, Square }
