import * as React from 'react'
import Menu from './Menu'
import Lobby from './Lobby'
import GameUI, { Props as GameProps } from './Game'
import {
    MuiThemeProvider,
	createMuiTheme,
	Icon,
	IconButton,
	CssBaseline,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	Grid,
    Typography,
} from '@material-ui/core'
import { Shadows } from '@material-ui/core/styles/shadows'

interface Props {
    package: string
}

interface State {
    lightTheme: boolean
    inGame: boolean
    online: boolean
    error?: Error
}

export default class App extends React.Component<Props, State> {

    private gameProps?: GameProps
    private name?: string

    readonly state: State = {
        lightTheme: true,
        inGame: false,
        online: false,
    }

    private static lightTheme = createMuiTheme({
        palette: { type: 'light' },
        typography: { useNextVariants: true },
    })

    private static darkTheme = createMuiTheme({
        palette: { type: 'dark' },
        typography: { useNextVariants: true },

        // Convert the darkest shadow used by the card to be light so it can actually be seen
        shadows: App.lightTheme.shadows.map((shadow, elevation) =>
            elevation == 24
                ? shadow.replace(/0,\s0,\s0/g, '255, 255, 255') // black to white
                : shadow) as Shadows,
    })

    static getDerivedStateFromError(error: Error) {
        return error
    }

    private startGame = (gameProps?: GameProps) => {
        this.gameProps = gameProps
        this.setState({inGame: true})
    }

    /** The player is ready to go online, take them to the lobby */
    private handleOnline = (name: string) => {
        if (!this.name) // don't overwrite name
            this.name = name
        this.setState({online: true})
    }

    private toggleTheme = () => this.setState({lightTheme: !this.state.lightTheme})

    private goBack = () => this.setState({inGame: false, online: false})

    private goOffline = () => this.setState({online: false})

    private onError = (error: Error) => this.setState({error})

    private removeError = () => this.setState({error: undefined})

    render = () =>
        <MuiThemeProvider theme={this.state.lightTheme ? App.lightTheme : App.darkTheme}>
            <CssBaseline />

            <IconButton onClick={this.toggleTheme} style={{
                    position: 'absolute',
                    right:    App.lightTheme.spacing.unit,
                    top:      App.lightTheme.spacing.unit,
            }}>
                    <Icon fontSize="small">wb_incandescent</Icon>
            </IconButton>

            {(this.state.inGame || this.state.online) &&
                <IconButton onClick={this.goBack} style={{
                        position: 'absolute',
                        left:     App.lightTheme.spacing.unit,
                        top:      App.lightTheme.spacing.unit,
                }}>
                        <Icon fontSize="small">arrow_back</Icon>
                </IconButton> }

            {this.state.error &&
                <Dialog open onClose={this.removeError}>
                    <DialogTitle>Oh No!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{this.state.error.message}</DialogContentText>
                        <Typography
                            variant="overline"
                            align="left"
                            style={{
                                fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
                                whiteSpace: 'pre',
                                display: 'none', // must go looking for this
                            }} >
                            {this.state.error.stack}
                            {JSON.stringify({...this.state.error}, null, 2)}
                        </Typography>
                    </DialogContent>
                </Dialog> }

            <Grid container style={{padding: '2em', textAlign: 'center'}} justify="center" spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="h2" gutterBottom>
                        Sets 
                        <span style={{fontSize: '.25em', marginLeft: '1em'}}>by Mo</span>
                    </Typography>
                </Grid>
                { this.state.inGame
                    ? <GameUI {...this.gameProps} />
                    : this.state.online
                        ? <Lobby package={this.props.package}
                                onError={this.onError}
                                name={this.name!}
                                onStart={this.startGame}
                                onDisconnect={this.goOffline} />
                        : <Menu name={this.name}
                                onStart={this.startGame}
                                onOnline={this.handleOnline} /> }
            </Grid>
        </MuiThemeProvider>
}
