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
    withStyles,
    createStyles,
    WithStyles,
    Theme,
} from '@material-ui/core'
import { Shadows } from '@material-ui/core/styles/shadows'

interface Props extends WithStyles<typeof styles> {
    package: string
}

interface State {
    lightTheme: boolean
    inGame: boolean
    online: boolean
    error?: Error
}

const styles = ({spacing, typography}: Theme) => createStyles({
    app: {
        padding: spacing.unit * 4, // dont touch the edge
        textAlign: 'center', // cause its a game

        // Weird horizontal scroll. Cause by negative margin and extra width
        // See: https://github.com/mui-org/material-ui/issues/7466
        margin: 0,
        width: '100%',
    },
    subTitle: {
        fontSize: typography.fontSize,
    },
    errorInfo: {
        fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
        whiteSpace: 'pre',
        display: process.env.NODE_ENV == 'development' ? 'block' : 'none',
    },

    top: { position: 'absolute', top: spacing.unit },
    left: { left: spacing.unit },
    right: { right: spacing.unit },
})

class App extends React.Component<Props, State> {

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
            elevation == 16
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

            {(this.state.inGame || this.state.online) &&
                <IconButton onClick={this.goBack} className={[this.props.classes.top, this.props.classes.left].join(' ')}>
                    <Icon fontSize="small">arrow_back</Icon>
                </IconButton> }

            <IconButton onClick={this.toggleTheme} className={[this.props.classes.top, this.props.classes.right].join(' ')}>
                <Icon fontSize="small">wb_incandescent</Icon>
            </IconButton>

            {this.state.error &&
                <Dialog open onClose={this.removeError}>
                    <DialogTitle>Oh No!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{this.state.error.message}</DialogContentText>
                        <Typography
                            variant="overline"
                            align="left"
                            className={this.props.classes.errorInfo} >
                            {this.state.error.stack}
                            {JSON.stringify({...this.state.error}, null, 2)}
                        </Typography>
                    </DialogContent>
                </Dialog> }

            <Grid container className={this.props.classes.app} justify="center" spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="h2" gutterBottom>
                        Sets{' '}
                        <span className={this.props.classes.subTitle}>by Mo</span>
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

export default withStyles(styles)(App)
