import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import './../../App.css';

class PushFunc extends Component {
    constructor(props) {
        super();
        this.state = {
            registers: ["fp"],
            variable1: "",
            variable2: "",
            variable3: "",
            variable4: "",
            variable5: "",
            variable6: "",

            parIn1: "",
            parIn2: "",
            parIn3: "",
            parIn4: "",
            parIn5: "",
            parIn6: "",

            parOut1: "",
            parOut2: "",
            parOut3: "",
            parOut4: "",
            parOut5: "",
            parOut6: "",

            numVar: 1,
            numParIn: 1,
            numParOut: 1,
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    incVar = () => {
        let newNum = this.state.numVar;
        newNum++;
        this.setState({
            numVar: newNum
        })
    }

    incParIn = () => {
        let newNum = this.state.numParIn;
        newNum++;
        this.setState({
            numParIn: newNum
        })
    }

    incParOut = () => {
        let newNum = this.state.numParOut;
        newNum++;
        this.setState({
            numParOut: newNum
        })
    }

    pushFunc = () => {
        let variables = [];
        let inParams = [];
        let outParams = [];

        if(!(this.state.variable1 === "")) {
            variables.push(this.state.variable1);
        }
        if(!(this.state.variable2 === "")) {
            variables.push(this.state.variable2);
        }
        if(!(this.state.variable3 === "")) {
            variables.push(this.state.variable3);
        }
        if(!(this.state.variable4 === "")) {
            variables.push(this.state.variable4);
        }
        if(!(this.state.variable5 === "")) {
            variables.push(this.state.variable5);
        }
        if(!(this.state.variable6 === "")) {
            variables.push(this.state.variable6);
        }

        if(!(this.state.parIn1 === "")) {
            inParams.push({arg: 5, value: this.state.parIn1});
        }
        if(!(this.state.parIn2 === "")) {
            inParams.push({arg: 6, value: this.state.parIn2});
        }
        if(!(this.state.parIn3 === "")) {
            inParams.push({arg: 7, value: this.state.parIn3});
        }
        if(!(this.state.parIn4 === "")) {
            inParams.push({arg: 8, value: this.state.parIn4});
        }
        if(!(this.state.parIn5 === "")) {
            inParams.push({arg: 9, value: this.state.parIn5});
        }
        if(!(this.state.parIn6 === "")) {
            inParams.push({arg: 10, value: this.state.parIn6});
        }

        if(!(this.state.parOut1 === "")) {
            outParams.push({arg: 5, value: this.state.parOut1});
        }
        if(!(this.state.parOut2 === "")) {
            outParams.push({arg: 6, value: this.state.parOut2});
        }
        if(!(this.state.parOut3 === "")) {
            outParams.push({arg: 7, value: this.state.parOut3});
        }
        if(!(this.state.parOut4 === "")) {
            outParams.push({arg: 8, value: this.state.parOut4});
        }
        if(!(this.state.parOut5 === "")) {
            outParams.push({arg: 9, value: this.state.parOut5});
        }
        if(!(this.state.parOut6 === "")) {
            outParams.push({arg: 10, value: this.state.parOut6});
        }
        let reverseInParams = [];
        let index = inParams.length - 1;
        for(let i = 0; i < inParams.length; i++) {
            reverseInParams[i] = inParams[index];
            index--;
        }
        let registers = this.sortRegisters(this.state.registers);
        let funcData = {registers: registers, vars: variables, inParams: reverseInParams, outParams: outParams, type: "function"}
        this.props.pushFunc(funcData);
        this.props.close();
    }

    sortRegisters = (registers) => {
        let numReg = [];
        let newReg = [];
        console.log(registers);
        for(const register of registers) {
            switch(register) {
                case "R0": {numReg.push(0); break;}
                case "R1": {numReg.push(1); break;}
                case "R2": {numReg.push(2); break;}
                case "R3": {numReg.push(3); break;}
                case "R4": {numReg.push(4); break;}
                case "R5": {numReg.push(5); break;}
                case "R6": {numReg.push(6); break;}
                case "R7": {numReg.push(7); break;}
                case "R8": {numReg.push(8); break;}
                case "R9": {numReg.push(9); break;}
                case "R10": {numReg.push(10); break;}
                case "fp": {numReg.push(11); break;}
                case "R12": {numReg.push(12); break;}
                case "sp": {numReg.push(13); break;}
                case "lr": {numReg.push(14); break;}
                case "pc": {numReg.push(15); break;}
                default: {}
            }
        }
        console.log(numReg);
        // Sort registers in reverse order
        numReg.sort((a,b)=>b-a)
        console.log(numReg);
        for(const num of numReg) {
            switch(num) {
                case 0: {newReg.push("R0"); break;}
                case 1: {newReg.push("R1"); break;}
                case 2: {newReg.push("R2"); break;}
                case 3: {newReg.push("R3"); break;}
                case 4: {newReg.push("R4"); break;}
                case 5: {newReg.push("R5"); break;}
                case 6: {newReg.push("R6"); break;}
                case 7: {newReg.push("R7"); break;}
                case 8: {newReg.push("R8"); break;}
                case 9: {newReg.push("R9"); break;}
                case 10: {newReg.push("R10"); break;}
                case 11: {newReg.push("fp"); break;}
                case 12: {newReg.push("R12"); break;}
                case 13: {newReg.push("sp"); break;}
                case 14: {newReg.push("lr"); break;}
                case 15: {newReg.push("pc"); break;}
                default: {}
            }
        }
        console.log(newReg);
        return(newReg);
    }

    addRegister = (e) => {
        let removed = false;
        let newArr = this.state.registers;

        if(this.state.registers.length === 0) {
            let newReg = this.state.registers;
            newReg.push(e.target.id);
            this.setState({
                registers: newReg
            })
        }

        else {
            for(const register of this.state.registers) {
                if(e.target.id === register) {
                    removed = true;
                    let i = 0;
                    while (i < newArr.length) {
                        if(newArr[i] === e.target.id) {
                            newArr.splice(i, 1);
                        } else {
                            ++i;
                        }
                    }
                }
            }

            if(!removed) {
                newArr.push(e.target.id);
                this.setState({
                    registers: newArr,
                })
            }
        }
        console.log(this.state.registers);
    }

    render() {
        return(
            <div>
                <form noValidate autoComplete = "off" onChange = {this.handleChange}>
                    <h3>
                        Select Saved Registers
                    </h3>

                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R0" />} label="R0" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R1" />} label="R1" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R2" />} label="R2" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R3" />} label="R3" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R4" />} label="R4" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R5" />} label="R5" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R6" />} label="R6" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R7" />} label="R7" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R8" />} label="R8" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R9" />} label="R9" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R10" />} label="R10" />
                    <FormControlLabel control={<Checkbox checked={true} id="fp" />} label="fp" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="R12" />} label="R12" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="sp" />} label="sp" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="lr" />} label="lr" />
                    <FormControlLabel control={<Checkbox onClick={this.addRegister} id="pc" />} label="pc" />

                    <h3>Add Local Variables {this.state.numVar > 5 ? <Button disabled>Add<AddIcon></AddIcon></Button> : <Button onClick={this.incVar}>Add<AddIcon></AddIcon></Button>}</h3>
                   
                    {this.state.numVar === 1 ?
                    <Grid item>
                        <TextField id = "variable1" label = "Enter Local Variable" variant = "outlined" /></Grid>
                    :
                    this.state.numVar === 2 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField defaultValue={this.state.variable1} id = "variable1" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "variable2" label = "Enter Local Variable" variant = "outlined" />  
                            </Grid>
                        </Grid>        
                    : this.state.numVar === 3 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "variable1" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "variable2" label = "Enter Local Variable" variant = "outlined" />  
                            </Grid>       
                            <Grid item>            
                                <TextField id = "variable3" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>      
                        </Grid>
                    : this.state.numVar === 4 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "variable1" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "variable2" label = "Enter Local Variable" variant = "outlined" /> 
                            </Grid>                    
                            <Grid item>
                                <TextField id = "variable3" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "variable4" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>
                        </Grid>
                    : this.state.numVar === 5 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "variable1" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "variable2" label = "Enter Local Variable" variant = "outlined" />  
                            </Grid>   
                            <Grid item>             
                                <TextField id = "variable3" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "variable4" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "variable5" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>  
                        </Grid>
                    : 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "variable1" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "variable2" label = "Enter Local Variable" variant = "outlined" />  
                            </Grid>   
                            <Grid item>             
                                <TextField id = "variable3" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "variable4" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "variable5" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "variable6" label = "Enter Local Variable" variant = "outlined" />
                            </Grid>  
                        </Grid>}

                    <h3>Add Incoming Parameters {this.state.numParIn > 5 ? <Button disabled>Add<AddIcon></AddIcon></Button> : <Button onClick={this.incParIn}>Add<AddIcon></AddIcon></Button>}</h3>
                   
                    {this.state.numParIn === 1 ?
                        <TextField id = "parIn1" label = "Enter Incoming Parameter" variant = "outlined" />
                    :
                    this.state.numParIn === 2 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField defaultValue={this.state.parIn1} id = "parIn1" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parIn2" label = "Enter Incoming Parameter" variant = "outlined" />  
                            </Grid>
                        </Grid>                   
                    : this.state.numParIn === 3 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "parIn1" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parIn2" label = "Enter Incoming Parameter" variant = "outlined" />  
                            </Grid>       
                            <Grid item>            
                                <TextField id = "parIn3" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>      
                        </Grid>
                    : this.state.numParIn === 4 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "parIn1" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parIn2" label = "Enter Incoming Parameter" variant = "outlined" /> 
                            </Grid>                    
                            <Grid item>
                                <TextField id = "parIn3" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parIn4" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>
                        </Grid>
                    : this.state.numParIn === 5 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "parIn1" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parIn2" label = "Enter Incoming Parameter" variant = "outlined" />  
                            </Grid>   
                            <Grid item>             
                                <TextField id = "parIn3" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parIn4" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parIn5" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>  
                        </Grid>
                    : 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "parIn1" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parIn2" label = "Enter Incoming Parameter" variant = "outlined" />  
                            </Grid>   
                            <Grid item>             
                                <TextField id = "parIn3" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parIn4" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parIn5" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parIn6" label = "Enter Incoming Parameter" variant = "outlined" />
                            </Grid>  
                        </Grid>}


                    <h3>Add Outgoing Parameters {this.state.numParOut > 5 ? <Button disabled>Add<AddIcon></AddIcon></Button> : <Button onClick={this.incParOut}>Add<AddIcon></AddIcon></Button>}</h3>

                    {this.state.numParOut === 1 ?
                    <TextField id = "parOut1" label = "Enter Outgoing Parameter" variant = "outlined" />
                    :
                    this.state.numParOut === 2 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField defaultValue={this.state.parOut1} id = "parOut1" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parOut2" label = "Enter Outgoing Parameter" variant = "outlined" />  
                            </Grid>
                        </Grid>                   
                    : this.state.numParOut === 3 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "parOut1" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parOut2" label = "Enter Outgoing Parameter" variant = "outlined" />  
                            </Grid>       
                            <Grid item>            
                                <TextField id = "parOut3" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>      
                        </Grid>
                    : this.state.numParOut === 4 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "parOut1" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parOut2" label = "Enter Outgoing Parameter" variant = "outlined" /> 
                            </Grid>                    
                            <Grid item>
                                <TextField id = "parOut3" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parOut4" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>
                        </Grid>
                    : this.state.numParOut === 5 ? 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "parOut1" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parOut2" label = "Enter Outgoing Parameter" variant = "outlined" />  
                            </Grid>   
                            <Grid item>             
                                <TextField id = "parOut3" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parOut4" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parOut5" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>  
                        </Grid>
                    : 
                        <Grid container class="Column">
                            <Grid item>
                                <TextField id = "parOut1" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>
                            <Grid item>
                                <TextField id = "parOut2" label = "Enter Outgoing Parameter" variant = "outlined" />  
                            </Grid>   
                            <Grid item>             
                                <TextField id = "parOut3" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parOut4" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parOut5" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>  
                            <Grid item>  
                                <TextField id = "parOut6" label = "Enter Outgoing Parameter" variant = "outlined" />
                            </Grid>  
                        </Grid>}

                    <br></br>
                    <br></br>

                    <Button variant="contained" color="primary" onClick={this.pushFunc}>Push</Button>
                </form>
            </div>
        )
    }
}

export default PushFunc;