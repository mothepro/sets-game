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
        if (opts)
            this.gameProps = opts
        this.setState({inGame: true})
    }

    render = () => <>
        <CssBaseline/>
        <MuiThemeProvider theme={this.state.light ? App.lightTheme : App.darkTheme}>

                <IconButton onClick={this.toggleTheme} style={{
                        position: 'absolute',
                        right:    App.lightTheme.spacing.unit,
                        top:      App.lightTheme.spacing.unit,
                }}>
                        <Icon fontSize="small">wb_incandescent</Icon>
                </IconButton>

                {this.state.error &&
                    <Dialog open>
                        <DialogTitle>Aww man... An error has occured</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{this.state.error.message}</DialogContentText>
                            <pre style={{textAlign: 'left'}}>{this.state.error.stack}</pre>
                            <pre style={{textAlign: 'left'}}>{JSON.stringify({...this.state.error}, null, 2)}</pre>
                        </DialogContent>
                    </Dialog> }

                <Grid container style={{padding: '2em'}} justify="center" spacing={24}>
                    <Grid item xs={12}>
                        <Typography variant="h2">
                            Sets 
                            <span style={{fontSize: '.25em', marginLeft: '1em'}}>by Mo</span>
                        </Typography>
                    </Grid>
                    { this.state.inGame
                            ? <GameUI {...this.gameProps} />
                            : <Menu
                                    package={this.props.package}
                                    onError={this.onError}
                                    onReady={this.onReady} /> }
                </Grid>
        </MuiThemeProvider>
    </>
}
