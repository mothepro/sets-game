import * as React from 'react'
import { MuiThemeProvider, createMuiTheme, Icon, IconButton, CssBaseline, Dialog, DialogTitle, DialogContent, DialogContentText, Grid, Typography } from '@material-ui/core'
import { Player } from 'sets-game-engine'
import Menu from './Menu'
import GameUI from './Game'

interface Props {
  package: string
}

interface State {
  light: boolean
  players: Player[]
  error?: Error
}

export default class App extends React.Component<Props, State> {

  public state: State = {
    light: true,
    players: [],
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
  toggleTheme = () => {
    document.body.style.backgroundColor = (!this.state.light ? App.lightTheme : App.darkTheme).palette.background.default
    this.setState({light: !this.state.light})
  }

  render = () =>
    <>
      <CssBaseline/>
      <MuiThemeProvider theme={this.state.light ? App.lightTheme : App.darkTheme}>

          <IconButton onClick={this.toggleTheme} style={{
              position: 'absolute',
              right:    App.lightTheme.spacing.unit,
              top:      App.lightTheme.spacing.unit,
          }}>
              <Icon fontSize="small">wb_incandescent</Icon>
          </IconButton>

          { this.state.error &&
              <Dialog open={true}>
                <DialogTitle id="alert-dialog-title">Aww man... An error has occured</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {this.state.error.message}
                    <pre>{this.state.error.stack}</pre>
                  </DialogContentText>
                </DialogContent>
              </Dialog>
          }

          <Typography variant="h2" align="center" style={{margin: '1em 0'}}>Sets</Typography>

          <Grid container style={{padding: '0 2em'}} justify="center" spacing={24}>
            { this.state.players.length
                ? <GameUI
                    players={this.state.players}
                    rng={(max: number) => Math.floor(Math.random() * max)} />
                : <Menu
                    package={this.props.package}
                    onReady={players => this.setState({players})} /> }
          </Grid>
      </MuiThemeProvider>
    </>
}
