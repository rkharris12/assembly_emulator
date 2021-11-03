import React from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Frame from './Frame.js'
import './../App.css'

class Stack extends React.Component {
    constructor() {
        super();
        this.state = {
            frames: [{
                address: 4096, 
                data: {
                    type: "top",
                }
            }],
        }
    }

    componentDidMount() {
        this.props.setPush(this.pushByReg);
        this.props.setPopReg(this.popRegister);
        this.props.setPop(this.pop);
        this.props.setLdr(this.loadByAddress);
        this.props.setStr(this.storeByAddress);
        this.props.setSp(this.setFrames);
        this.props.setFunction(this.handleFuction);
        this.props.setClear(this.clear);
        this.props.setRemoveFrames(this.removeFrames);
     }

    decimalToHex = (decimalNumber) => {
        let hexNum = [];
    
        while(decimalNumber!==0) {
            let temp  = 0; 
            temp = decimalNumber % 16; 
           
            if(temp < 10) {
                hexNum.push(String.fromCharCode(temp + 48)); 
            } 
            else {
                hexNum.push(String.fromCharCode(temp + 55)); 
            } 
            decimalNumber = decimalNumber/16; 
        } 

        let reverse = []
        let j = 2;
        for(let i = 3; i >= 0; i--) {
            reverse[j] = hexNum[i];
            j++;
        }
        reverse[0] = '0';
        reverse[1] = 'x';
        return(reverse);
    }

    setFrames = (sp) => {
        // If the sp is moved down, fill space with empty frames
        if(this.state.frames.length === 0) {
            return;
        }
        let lowAddress = this.state.frames[this.state.frames.length - 1].address;
        // console.log("low address: " + lowAddress);
        while(sp < lowAddress) {
            lowAddress -= 4;
            this.pushEmpty(lowAddress);
        }
    }

    loadByAddress = (data) => {
        let newFrames = this.state.frames;
        for(const frame of newFrames) {
            if(frame.address === data.address) {
                // console.log(frame);
                // console.log(frame.data.value);
                this.props.setReg({reg: data.reg, value: frame.data.value});
            }
        }
    }

    storeByAddress = (data) => {
        let newFrames = this.state.frames;
        for(const frame of newFrames) {
            if(frame.address === data.address) {
                frame.data.value = data.value;
            }
        }
        this.setState({
            frames: newFrames
        })
    }

    handleFuction = (data) => {
        if(data.type === "function") {
            this.pushFunc(data);
        }
        if(data.type === "inParam") {
            this.pushByInParam(data);
        }
        if(data.type === "outParam") {
            this.pushByOutParam(data);
        }
        if(data.type === "variable") {
            this.pushByVar(data);
        }
        
    }

    pushFunc = (data) => {
        for(const inParam of data.inParams) {
            this.pushByInParam(inParam);
        }
        for(const reg of data.registers) {
            this.pushByReg(reg);
        }
        for(const variable of data.vars) {
            this.pushByVar(variable);
        }
        for(let i = 0; i < data.outParams.length; i++) {
            this.pushByOutParam(data.outParams[data.outParams.length - 1 - i]);
        }

        let newFp = this.props.register.sp - 4;

        for(let i = 0; i < data.outParams.length; i++) {
            newFp += 4;
        }
        for(let i = 0; i < data.registers.length; i++) {
            newFp += 4;
        }
        for(let i = 0; i < data.vars.length; i++) {
            newFp += 4;
        }
       
        this.props.setReg({reg: "fp", value: newFp});
    }

    pushByReg = (reg) => {
        // console.log(reg);

        switch(reg) {
            case "R0": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R0", value: this.props.register.R0, arg: null}}); break;}
            case "R1": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R1", value: this.props.register.R1, arg: null}}); break;}
            case "R2": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R2", value: this.props.register.R2, arg: null}}); break;}
            case "R3": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R3", value: this.props.register.R2, arg: null}}); break;}
            case "R4": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R4", value: this.props.register.R4, arg: null}}); break;}
            case "R5": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R5", value: this.props.register.R5, arg: null}}); break;}
            case "R6": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R6", value: this.props.register.R6, arg: null}}); break;}
            case "R7": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R7", value: this.props.register.R7, arg: null}}); break;}
            case "R8": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R8", value: this.props.register.R8, arg: null}}); break;}
            case "R9": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R9", value: this.props.register.R9, arg: null}}); break;}
            case "R10": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R10", value: this.props.register.R10, arg: null}}); break;}
            case "fp": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "fp", value: this.props.register.fp, arg: null}}); break;}
            case "R12": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "R12", value: this.props.register.R12, arg: null}}); break;}
            case "sp": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "sp", value: this.props.register.sp, arg: null}}); break;}
            case "lr": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "lr", value: this.props.register.lr, arg: null}}); break;}
            case "pc": {this.push({address: this.props.register.sp-4, data: {type: "reg", reg: "pc", value: this.props.register.pc, arg: null}}); break;}
            default: {}
        }
    }

    pushByVar = (variable) => {
        this.push({address: this.props.register.sp-4, data: {type: "var", value: variable, arg: null}});
    }

    pushEmpty = (address) => {
        let newFrames = this.state.frames;
        newFrames.push({address: address, data: {type: "empty", value: 0, arg: null}});

        this.setState({
            frames: newFrames,
        }) 
    }

    pushByOutParam = (parameter) => {
        this.push({address: this.props.register.sp-4, data: {type: "outParam", value: parameter.value, arg: parameter.arg}});
    }

    pushByInParam = (parameter) => {
        this.push({address: this.props.register.sp-4, data: {type: "inParam", value: parameter.value, arg: parameter.arg}});
    }

    push = (data) => {
        let newFrames = this.state.frames;
        newFrames.push(data);

        this.setState({
            frames: newFrames,
        }) 

        this.props.decSp();
        // console.log(this.state.frames);
    }

    pop = () => {
        if(this.state.frames.length < 2) {
            alert("Attempted to pop from an empty stack");
            return;
        }

        let curFrames = this.state.frames;
        let frame = curFrames.pop();
        if(frame.data.type === "reg") {
            switch(frame.data.reg) {
                case "R0": {this.props.setReg({reg: "R0", value: frame.data.value}); break;}
                case "R1": {this.props.setReg({reg: "R1", value: frame.data.value}); break;}
                case "R2": {this.props.setReg({reg: "R2", value: frame.data.value}); break;}
                case "R3": {this.props.setReg({reg: "R3", value: frame.data.value}); break;}
                case "R4": {this.props.setReg({reg: "R4", value: frame.data.value}); break;}
                case "R5": {this.props.setReg({reg: "R5", value: frame.data.value}); break;}
                case "R6": {this.props.setReg({reg: "R6", value: frame.data.value}); break;}
                case "R7": {this.props.setReg({reg: "R7", value: frame.data.value}); break;}
                case "R8": {this.props.setReg({reg: "R8", value: frame.data.value}); break;}
                case "R9": {this.props.setReg({reg: "R9", value: frame.data.value}); break;}
                case "R10": {this.props.setReg({reg: "R10", value: frame.data.value}); break;}
                case "fp": {this.props.setReg({reg: "fp", value: frame.data.value}); break;}
                case "R12": {this.props.setReg({reg: "R12", value: frame.data.value}); break;}
                case "sp": {this.props.setReg({reg: "sp", value: frame.data.value}); break;}
                case "lr": {this.props.setReg({reg: "lr", value: frame.data.value}); break;}
                case "pc": {this.props.setReg({reg: "pc", value: frame.data.value}); break;}
                default: {}
            }
        }

        this.setState({
            frames: curFrames,
        })
        if(frame.data.reg !== "sp") {
            this.props.incSp();
        }
    }

    popRegister = (reg) => {
        let curFrames = this.state.frames;
        if(curFrames.length < 2) {
            alert("Attempted to pop from an empty stack");
            return;
        }
        let frame = curFrames.pop();

        switch(reg) {
            case "R0": {this.props.setReg({reg: "R0", value: frame.data.value}); break;}
            case "R1": {this.props.setReg({reg: "R1", value: frame.data.value}); break;}
            case "R2": {this.props.setReg({reg: "R2", value: frame.data.value}); break;}
            case "R3": {this.props.setReg({reg: "R3", value: frame.data.value}); break;}
            case "R4": {this.props.setReg({reg: "R4", value: frame.data.value}); break;}
            case "R5": {this.props.setReg({reg: "R5", value: frame.data.value}); break;}
            case "R6": {this.props.setReg({reg: "R6", value: frame.data.value}); break;}
            case "R7": {this.props.setReg({reg: "R7", value: frame.data.value}); break;}
            case "R8": {this.props.setReg({reg: "R8", value: frame.data.value}); break;}
            case "R9": {this.props.setReg({reg: "R9", value: frame.data.value}); break;}
            case "R10": {this.props.setReg({reg: "R10", value: frame.data.value}); break;}
            case "fp": {this.props.setReg({reg: "fp", value: frame.data.value}); break;}
            case "R12": {this.props.setReg({reg: "R12", value: frame.data.value}); break;}
            case "sp": {this.props.setReg({reg: "sp", value: frame.data.value}); break;}
            case "lr": {this.props.setReg({reg: "lr", value: frame.data.value}); break;}
            case "pc": {this.props.setReg({reg: "pc", value: frame.data.value}); break;}
            default: {}
        }

        this.setState({
            frames: curFrames,
        })
        this.props.incSp();
    }

    removeFrames = () => {
        let newFrames = this.state.frames;
        for(let i = newFrames.length - 1; i >= 0; i--) {
            let frame = newFrames[i];
            if(frame.address < this.props.register.sp) {
                newFrames.pop();
            }
        }
        this.setState({
            frames: newFrames,
        })
    }

    clear = () => {
        let clearFrames = [{address: 4096, data: {type: "top"}}];
        this.setState({
            frames: clearFrames,
        })
        this.props.setReg({reg: "fp", value: 4096});
        this.props.setReg({reg: "sp", value: 4096});
    }

    render() {
        return(
            <Grid container className="Stack">
                <Grid item className="StackHeaderItem">
                    <Grid container className="StackHeaderContainer">

                        <Grid item style={{paddingRight: "4vw"}}>
                            {this.state.frames.length === 1 ? <h2>Stack ({this.state.frames.length} address)</h2> :<h2>Stack ({this.state.frames.length} addresses)</h2>} 
                        </Grid>

                        <Grid item>
                            <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "0.5vw", minWidth: "4vw", minHeight: "2vw", width: "4vw", height: "2vw"}} variant="contained" color="secondary" onClick={this.clear}>Clear</Button>
                        </Grid>

                    </Grid>
                </Grid>

                <Grid conatiner className="Scroll">
                {
                    this.state.frames.map(frame =>
                        <Grid container className="StackFrames"> 
                                {(this.props.register.sp === frame.address && this.props.register.fp === frame.address) ? 
                                        <Grid item>
                                            {this.decimalToHex(frame.address).map(char => char)}
                                            <Grid container className="StackAddress">
                                                <Grid item>
                                                    fp <ArrowRightAltIcon style = {{fontSize: "1vw"}}></ArrowRightAltIcon>
                                                </Grid>
                                                <Grid>
                                                    sp <ArrowRightAltIcon style = {{fontSize: "1vw"}}></ArrowRightAltIcon>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                :    
                                this.props.register.sp === frame.address ?
                                        <Grid item>
                                            <Grid container className="StackAddress">
                                                <Grid item>
                                                    {this.decimalToHex(frame.address).map(char => char)}
                                                </Grid>
                                                <Grid item>
                                                    sp <ArrowRightAltIcon style = {{fontSize: "1vw"}}></ArrowRightAltIcon>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                :      
                                this.props.register.fp === frame.address ?
                                    <Grid item>
                                        <Grid container className="StackAddress">
                                            <Grid item>
                                                {this.decimalToHex(frame.address).map(char => char)}
                                            </Grid>
                                            <Grid item>
                                                fp <ArrowRightAltIcon style = {{fontSize: "1vw"}}></ArrowRightAltIcon>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                : 
                                <Grid item>
                                    {this.decimalToHex(frame.address).map(char => char)}
                                </Grid>}

                            <Grid item>
                                <Frame params={frame} register={this.props.register}></Frame>
                            </Grid>

                        </Grid>
                    )   
                }
                </Grid>
            </Grid>
        )
    }
}

export default Stack;