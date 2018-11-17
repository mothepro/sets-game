import * as React from 'react'
import { MuiThemeProvider, createMuiTheme, Icon, IconButton, CssBaseline, Dialog, DialogTitle, DialogContent, DialogContentText, Grid, Typography } from '@material-ui/core'
import Menu from './Menu'
import GameUI, { Props as GameProps } from './Game'

interface Props {
    package: string
}

interface State {
    light: boolean
    inGame: boolean
    error?: Error
}

export default class App extends React.Component<Props, State> {

    private gameProps?: GameProps
    readonly state: State = {
        light: true,
        inGame: false,
    }

    private static darkTheme = createMuiTheme({
            palette: { type: 'dark' },
            typography: { useNextVariants: true },
        })
    private static lightTheme = createMuiTheme({
            palette: { type: 'light' },
            typography: { useNextVariants: true },
        })

    static getDerivedStateFromError(error: Error) {
        return error
    }

    /** Switches Material UI Theme and body's background color */
    private toggleTheme = () => {
        document.body.style.backgroundColor = (!this.state.light ? App.lightTheme : App.darkTheme).palette.background.default
        this.setState({light: !this.state.light})
    }

    private onError = (error: Error) => this.setState({error})

    private onReady = (opts?: GameProps) => {
        this.gameProps = opts
        this.setState({inGame: true})
    }

    render = () =>
        <MuiThemeProvider theme={this.state.light ? App.lightTheme : App.darkTheme}>
            <CssBaseline />

            <IconButton onClick={this.toggleTheme} style={{
                    position: 'absolute',
                    right:    App.lightTheme.spacing.unit,
                    top:      App.lightTheme.spacing.unit,
            }}>
                    <Icon fontSize="small">wb_incandescent</Icon>
            </IconButton>

            {this.state.error &&
                <Dialog open>
                    <DialogTitle>Oh no... An error has occured</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{this.state.error.message}</DialogContentText>
                        <Typography
                            variant="overline"
                            align="left"
                            style={{
                                fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
                                whiteSpace: 'pre',
                            }} >
                            {this.state.error.stack}
                            {JSON.stringify({...this.state.error}, null, 2)}
                        </Typography>
                    </DialogContent>
                </Dialog> }

            <Grid container style={{padding: '2em'}} justify="center" spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="h2" gutterBottom>
                        Sets 
                        <span style={{fontSize: '.25em', marginLeft: '1em'}}>by Mo</span>
                    </Typography>
                </Grid>
                { this.state.inGame
                        ? <GameUI {...this.gameProps} />
                        : <Menu package={this.props.package}
                                onError={this.onError}
                                onReady={this.onReady} /> }
            </Grid>
        </MuiThemeProvider>
}