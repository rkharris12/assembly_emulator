import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import './../App.css';
import './../styles/Frames.css';

class Framex86 extends React.Component {
    
    render() {
        return(
            <div>
                {(this.props.params.data.type === "reg") ?
                    <Grid item className="StackItem">
                        <Grid item className="Text">
                            <Typography className={this.props.params.address <= this.props.register.rbp ? "RegisterOutline" : "Register"}>
                                <h2 className="Text">Register: from {this.props.params.data.reg} &nbsp; value: {this.props.params.data.value} </h2>
                            </Typography>
                        </Grid>
                    </Grid>
                :
                this.props.params.data.type === "var" ?
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.rbp ? "VariableOutline" : "Variable"}>
                                {this.props.params.address - this.props.register.rbp > 0 ? 
                                <h2 className="Text"> Local Variable: (rbp + {this.props.params.address - this.props.register.rbp}) &nbsp; value: {this.props.params.data.value} </h2> 
                                : 
                                <h2 className="Text"> Local Variable: (rbp - {Math.abs(this.props.params.address - this.props.register.rbp)}) &nbsp; value: {this.props.params.data.value} </h2>}
                            </Typography>
                        </Grid>
                    </Grid>
                :
                this.props.params.data.type === "outParam" ?
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.rbp ? "OutParameterOutline" : "OutParameter"}>
                                {this.props.params.address - this.props.register.rbp > 0 ? 
                                    <h2 className="Text"> Outgoing Parameter: (arg {this.props.params.data.arg}) &nbsp; (rbp + {this.props.params.address - this.props.register.rbp}) &nbsp; value: {this.props.params.data.value} </h2> 
                                    : 
                                    <h2 className="Text"> Outgoing Parameter: (arg {this.props.params.data.arg}) &nbsp; (rbp - {Math.abs(this.props.params.address - this.props.register.rbp)}) &nbsp; value: {this.props.params.data.value} </h2>}
                            </Typography>
                        </Grid>
                    </Grid>
                : 
                this.props.params.data.type === "empty" ?
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.rbp ? "EmptyOutline" : "Empty"}>
                                {this.props.params.address - this.props.register.rbp > 0 ? 
                                    <h2 className="Text"> (rbp + {this.props.params.address - this.props.register.rbp}) &nbsp; value: {this.props.params.data.value} </h2> 
                                    : 
                                    <h2 className="Text"> (rbp - {Math.abs(this.props.params.address - this.props.register.rbp)}) &nbsp; value: {this.props.params.data.value} </h2>}
                            </Typography>
                        </Grid>
                    </Grid>
                :
                this.props.params.data.type === "inParam" ?
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.rbp ? "InParameterOutline" : "InParameter"}>
                                {this.props.params.address - this.props.register.rbp > 0 ? 
                                    <h2 className="Text"> Incoming Parameter: (arg {this.props.params.data.arg}) &nbsp; (rbp + {this.props.params.address - this.props.register.rbp}) &nbsp; value: {this.props.params.data.value} </h2> 
                                    : 
                                    <h2 className="Text"> Incoming Parameter: (arg {this.props.params.data.arg}) &nbsp; (rbp - {Math.abs(this.props.params.address - this.props.register.rbp)}) &nbsp; value: {this.props.params.data.value} </h2>}
                            </Typography>
                        </Grid>
                    </Grid>
                :
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.rbp ? "TopOutline" : "Top"}>
                                    <h2 className="Text">Bottom of Stack</h2> 
                            </Typography>
                        </Grid>
                    </Grid>
                }
            </div>
        )
    }
}

export default Framex86;