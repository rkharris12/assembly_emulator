import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import './../../App.css';

class PushInParam extends Component {
    constructor(props) {
        super();
        this.state = {
            parameter: 0,
            arg: "",
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    pushInParam = () => {
        this.props.pushInParam({value: this.state.parameter, arg: this.state.arg, type: "inParam"});
        this.props.close();
    }

    render() {
        return(
            <div>
                <form noValidate autoComplete = "off" onChange = {this.handleChange}>
                    <div className="Column">
                        <div>
                            <TextField id = "parameter" label = "Enter Parameter" variant = "outlined" />
                        </div>                        
                        <div>
                            <TextField id = "arg" label = "Enter Argument Number" variant = "outlined" />
                        </div>                        
                    </div>
                    <Button onClick={this.pushInParam}>Push</Button>
                </form>
            </div>
        )
    }
}

export default PushInParam;