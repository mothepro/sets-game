import * as React from 'react'
import { Button, TextField, Grid, Icon } from '@material-ui/core'

interface Props {
    name?:    string
    onStart:  () => void
    onOnline: (name: string) => void
    onError?: (error: Error) => void
}

interface State {
    name: string
}

export default class Menu extends React.PureComponent<Props, State> {

    readonly state: State = {
        name: this.props.name || '',
    }

    private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({name: event.target.value})

    private handleGoOnline = (e: React.FormEvent) => {
        e.preventDefault()
        this.props.onOnline(this.state.name)
    }

    // this is needed or else a `MouseEvent` will be passed as the first prop
    private handleGoSolo = () => this.props.onStart()

    render = () => <> 
        <Grid item container justify="center" sm={6}>
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={this.handleGoSolo} >
                    <Icon style={{margin: '.5em 1em .5em 0'}}>person_outline</Icon>
                    Play Solo
            </Button>
        </Grid>
        <Grid item container justify="center" sm={6}>
            <form onSubmit={this.handleGoOnline} noValidate autoComplete="off">
                <TextField
                    label="Name"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                    variant="outlined"
                    autoCorrect="off"
                    style={{marginBottom: '1em'}}
                    inputProps={{
                        maxLength: 50,
                        readOnly: !!this.props.name,
                    }} />
                <br/>
                <Button
                    disabled={this.state.name.trim().length < 2}
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit" >
                        <Icon style={{margin: '.5em 1em .5em 0'}}>people_outline</Icon>
                        Play with People
                </Button>
            </form>
        </Grid>
    </>
}
