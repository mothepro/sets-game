import * as React from 'react'
import { SvgIcon } from '@material-ui/core'

/**
 * This data is taken from @material-ui/icons repo and moved into here.
 * Move data here since not all icons are used and the compilers aren't good enough to remove unused assets.
 * Even if they are, compiling would still take a long time.
 * 
 * How to get Icon's SVG data
 * https://github.com/mui-org/material-ui/blob/master/packages/material-ui-icons/src/{{Name}}{{Style}}.js
 *  Name  = Camel Case Icon name. Found at https://material.io/tools/icons/ 
 *  Style = TwoTone | Filled | Sharp | Outlined | Rounded
 */
const SvgData = {
    LightBulb: <>
        <path fill="none" d="M0 0h24v24H0V0z" />
        <g>
            <path d="M14 8.59l-1-.58V4.05h-2v3.96l-1 .58c-1.24.72-2 2.04-2 3.46 0 2.21 1.79 4 4 4s4-1.79 4-4c0-1.42-.77-2.74-2-3.46z" opacity=".3" />
            <path d="M3.55 19.09l1.41 1.41 1.79-1.8-1.41-1.41zM11 20h2v3h-2zM1 11h3v2H1zM15 6.86V2.05H9v4.81C7.21 7.9 6 9.83 6 12.05c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.22-1.21-4.15-3-5.19zm-3 9.19c-2.21 0-4-1.79-4-4 0-1.42.77-2.74 2-3.46l1-.58V4.05h2v3.96l1 .58c1.24.72 2 2.04 2 3.46 0 2.21-1.79 4-4 4zM20 11h3v2h-3zM17.24 18.71l1.79 1.8 1.41-1.41-1.8-1.79z" />
        </g>
    </>,

    SquareFilled: <>
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z" />
    </>,

    SquareOutline: <>
        <path fill="none" d="M0 0h24v24H0V0z" />
        <g>
            <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z" />
        </g>
    </>,

    SquareTwoTone: <>
        <path fill="none" d="M0 0h24v24H0V0z" />
        <g>
            <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z" />
        </g>
    </>,

    TriangleTwoTone: <>
        <path fill="none" d="M0 0h24v24H0V0z" />
        <g>
            <path d="M12 7.77L5.61 18h12.78z" opacity=".3" />
            <path d="M12 4L2 20h20L12 4zm0 3.77L18.39 18H5.61L12 7.77z" />
        </g>
    </>,

    TriangleOutline: <>
        <path fill="none" d="M0 0h24v24H0V0z" />
        <g>
            <path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z" />
        </g>
    </>,
    
    TriangleFilled: <>
        <path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z" />
        <path fill="none" d="M0 0h24v24H0V0z" />
    </>,

    CircleFilled: <>
        <circle cx="12" cy="12" r="10" />
        <path fill="none" d="M0 0h24v24H0z" />
    </>,

    CircleOutline: <>
        <path fill="none" d="M0 0h24v24H0V0z" />
        <g>
            <path d="M12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8m0-2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        </g>
    </>,

    CircleTwoTone: <>
        <path fill="none" d="M0 0h24v24H0V0z" />
        <g>
            <path d="M12 20c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8z" opacity=".3" />
            <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z" />
        </g>
    </>,
}


export default function Icon(props: {
        name: keyof typeof SvgData,
        size?: number,
        [others: string]: any,
    }) {
    return <SvgIcon
        {...props as {}}
        style={{
            width: `${props.size}em`,
            height: `${props.size}em`,
        }}
    >
        {SvgData[props.name]}
    </SvgIcon>
}
