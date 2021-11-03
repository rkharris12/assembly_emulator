import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import './../../App.css';

class PushVar extends Component {
    constructor(props) {
        super();
        this.state = {
            variable: 0
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    pushVar = () => {
        this.props.pushVar({value: this.state.variable, type: "variable"});
        this.props.close();
    }

    render() {
        return(
            <div>
                <form noValidate autoComplete = "off" onChange = {this.handleChange}>
                    <TextField id = "variable" label = "Enter Variable" variant = "outlined" />
                    <Button onClick={this.pushVar}>Push</Button>
                </form>
            </div>
        )
    }
}

export default PushVar;