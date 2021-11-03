import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import './../App.css';
import './../styles/Frames.css';

class Frame extends React.Component {
    
    render() {
        return(
            <div>
                {(this.props.params.data.type === "reg") ?
                    <Grid item className="StackItem">
                        <Grid item className="Text">
                            <Typography className={this.props.params.address <= this.props.register.fp ? "RegisterOutline" : "Register"}>
                                <h2 className="Text">Register: from {this.props.params.data.reg} &nbsp; value: {this.props.params.data.value} </h2>
                            </Typography>
                        </Grid>
                    </Grid>
                :
                this.props.params.data.type === "var" ?
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "VariableOutline" : "Variable"}>
                                {this.props.params.address - this.props.register.fp > 0 ? 
                                <h2 className="Text"> Local Variable: (fp + {this.props.params.address - this.props.register.fp}) &nbsp; value: {this.props.params.data.value} </h2> 
                                : 
                                <h2 className="Text"> Local Variable: (fp - {Math.abs(this.props.params.address - this.props.register.fp)}) &nbsp; value: {this.props.params.data.value} </h2>}
                            </Typography>
                        </Grid>
                    </Grid>
                :
                this.props.params.data.type === "outParam" ?
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "OutParameterOutline" : "OutParameter"}>
                                {this.props.params.address - this.props.register.fp > 0 ? 
                                    <h2 className="Text"> Outgoing Parameter: (arg {this.props.params.data.arg}) &nbsp; (fp + {this.props.params.address - this.props.register.fp}) &nbsp; value: {this.props.params.data.value} </h2> 
                                    : 
                                    <h2 className="Text"> Outgoing Parameter: (arg {this.props.params.data.arg}) &nbsp; (fp - {Math.abs(this.props.params.address - this.props.register.fp)}) &nbsp; value: {this.props.params.data.value} </h2>}
                            </Typography>
                        </Grid>
                    </Grid>
                : 
                this.props.params.data.type === "empty" ?
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "EmptyOutline" : "Empty"}>
                                {this.props.params.address - this.props.register.fp > 0 ? 
                                    <h2 className="Text"> (fp + {this.props.params.address - this.props.register.fp}) &nbsp; value: {this.props.params.data.value} </h2> 
                                    : 
                                    <h2 className="Text"> (fp - {Math.abs(this.props.params.address - this.props.register.fp)}) &nbsp; value: {this.props.params.data.value} </h2>}
                            </Typography>
                        </Grid>
                    </Grid>
                :
                this.props.params.data.type === "inParam" ?
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "InParameterOutline" : "InParameter"}>
                                {this.props.params.address - this.props.register.fp > 0 ? 
                                    <h2 className="Text"> Incoming Parameter: (arg {this.props.params.data.arg}) &nbsp; (fp + {this.props.params.address - this.props.register.fp}) &nbsp; value: {this.props.params.data.value} </h2> 
                                    : 
                                    <h2 className="Text"> Incoming Parameter: (arg {this.props.params.data.arg}) &nbsp; (fp - {Math.abs(this.props.params.address - this.props.register.fp)}) &nbsp; value: {this.props.params.data.value} </h2>}
                            </Typography>
                        </Grid>
                    </Grid>
                :
                    <Grid item className="StackItem">
                        <Grid item>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "TopOutline" : "Top"}>
                                    <h2 className="Text">Bottom of Stack</h2> 
                            </Typography>
                        </Grid>
                    </Grid>
                }
            </div>
        )
    }
}

export default Frame;