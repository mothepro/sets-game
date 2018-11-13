import * as React from 'react'
import { CircularProgress, Typography } from "@material-ui/core"
import { CircularProgressProps } from '@material-ui/core/CircularProgress'


export default function(props: CircularProgressProps) {
    let { children, size } = props

    if (typeof size != 'number' || size == 0)
        size = 24

    if (typeof children == 'string')
        children = <Typography variant="overline" style={{marginTop: '1em'}}>{children}</Typography>

    return <div style={{
            position:   'absolute',
            top:        '50%',
            left:       '50%',
            marginTop:  size / -2,
            marginLeft: size / -2,
        }} >
            <CircularProgress {...props} size={size} />
            {children}
        </div>
}
