import {name, version} from '../package.json'
import * as React from 'react'
import { render } from 'react-dom'
import { MuiThemeProvider, createMuiTheme, Icon, IconButton, CssBaseline } from '@material-ui/core'

interface Props {
  package: string
}

interface State {
  light: boolean
}

class App extends React.Component<Props, State> {
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
              <Icon fontSize="small">wb_incandescent</Icon>
          </IconButton>
      </MuiThemeProvider>
    </>
  }
}

render(<App package={`${name}@${version}`} />, document.getElementById('app'))
