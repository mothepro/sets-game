import * as React from 'react'
import { MuiThemeProvider, createMuiTheme, IconButton, CssBaseline } from '@material-ui/core'
import { Player } from 'sets-game-engine'
import Menu from './Menu'
import GameUI from './Game'
import Icon from './Icon'

interface Props {
  package: string
}

interface State {
  light: boolean
  players?: Player[]
}

export default class App extends React.Component<Props, State> {
  private static darkTheme = createMuiTheme({
      palette: { type: 'dark' },
      typography: { useNextVariants: true },
    })

  private static lightTheme = createMuiTheme({
      palette: { type: 'light' },
      typography: { useNextVariants: true },
    })

  constructor(props: Props) {
    super(props)

    this.state = {
      light: true,
    }
  }

  /** Switches Material UI Theme and body's background color */
  toggleTheme = () => {
    document.body.style.backgroundColor = (!this.state.light ? App.lightTheme : App.darkTheme).palette.background.default
    this.setState({light: !this.state.light})
  }

  render() {
    return <>
      <CssBaseline/>
      <MuiThemeProvider theme={this.state.light ? App.lightTheme : App.darkTheme}>

          <IconButton onClick={this.toggleTheme} style={{
              position: 'absolute',
              right:    App.lightTheme.spacing.unit,
              top:      App.lightTheme.spacing.unit,
          }}>
              <Icon fontSize="small" name="WbIncandescentTwoTone" />
          </IconButton>

          { this.state.players
              ? <GameUI players={this.state.players} />
              : <Menu package={this.props.package} onReady={players => this.setState({players})} /> }
      </MuiThemeProvider>
    </>
  }
}
