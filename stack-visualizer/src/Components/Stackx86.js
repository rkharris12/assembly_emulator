import React from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Framex86 from './Framex86.js'
import './../App.css'

class Stackx86 extends React.Component {
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

    setFrames = (rsp) => {
        // If the rsp is moved down, fill space with empty frames
        if(this.state.frames.length === 0) {
            return;
        }
        let lowAddress = this.state.frames[this.state.frames.length - 1].address;
        // console.log("low address: " + lowAddress);
        while(rsp < lowAddress) {
            lowAddress -= 8;
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

        let newFp = this.props.register.rsp - 8;

        for(let i = 0; i < data.outParams.length; i++) {
            newFp += 8;
        }
        for(let i = 0; i < data.registers.length; i++) {
            newFp += 8;
        }
        for(let i = 0; i < data.vars.length; i++) {
            newFp += 8;
        }
       
        this.props.setReg({reg: "rbp", value: newFp});
    }

    pushByReg = (reg) => {
        //console.log(reg);

        switch(reg) {
            case "rax": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "rax", value: this.props.register.rax, arg: null}}); break;}
            case "rbx": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "rbx", value: this.props.register.rbx, arg: null}}); break;}
            case "rcx": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "rcx", value: this.props.register.rcx, arg: null}}); break;}
            case "rdx": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "rdx", value: this.props.register.rdx, arg: null}}); break;}
            case "rsi": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "rsi", value: this.props.register.rsi, arg: null}}); break;}
            case "rdi": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "rdi", value: this.props.register.rdi, arg: null}}); break;}
            case "rsp": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "rsp", value: this.props.register.rsp, arg: null}}); break;}
            case "rbp": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "rbp", value: this.props.register.rbp, arg: null}}); break;}
            case "rip": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "rip", value: this.props.register.rip, arg: null}}); break;}
            case "r8": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "r8", value: this.props.register.r8, arg: null}}); break;}
            case "r9": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "r9", value: this.props.register.r9, arg: null}}); break;}
            case "r10": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "r10", value: this.props.register.r10, arg: null}}); break;}
            case "r11": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "r11", value: this.props.register.r11, arg: null}}); break;}
            case "r12": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "r12", value: this.props.register.r12, arg: null}}); break;}
            case "r13": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "r13", value: this.props.register.r13, arg: null}}); break;}
            case "r14": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "r14", value: this.props.register.r14, arg: null}}); break;}
            case "r15": {this.push({address: this.props.register.rsp-8, data: {type: "reg", reg: "r15", value: this.props.register.r15, arg: null}}); break;}
            default: {this.push({address: this.props.register.rsp-8, data: {type: "var", value: reg, arg: null}}); break;}
        }
    }

    pushByVar = (variable) => {
        this.push({address: this.props.register.rsp-8, data: {type: "var", value: variable, arg: null}});
    }

    pushEmpty = (address) => {
        let newFrames = this.state.frames;
        newFrames.push({address: address, data: {type: "empty", value: 0, arg: null}});

        this.setState({
            frames: newFrames,
        }) 
    }

    pushByOutParam = (parameter) => {
        this.push({address: this.props.register.rsp-8, data: {type: "outParam", value: parameter.value, arg: parameter.arg}});
    }

    pushByInParam = (parameter) => {
        this.push({address: this.props.register.rsp-8, data: {type: "inParam", value: parameter.value, arg: parameter.arg}});
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

    pop = (ret) => {
        if(this.state.frames.length < 2) {
            alert("Attempted to pop from an empty stack");
            return;
        }

        console.log("pop in Stackx86");
        console.log(ret)
        let curFrames = this.state.frames;
        let frame = curFrames.pop();
        if (ret) {
          this.props.setReg({reg: "rip", value: frame.data.value + 0});
        } else {
          if(frame.data.type === "reg") {
            switch(frame.data.reg) {
                case "rax": {this.props.setReg({reg: "rax", value: frame.data.value}); break;}
                case "rbx": {this.props.setReg({reg: "rbx", value: frame.data.value}); break;}
                case "rcx": {this.props.setReg({reg: "rcx", value: frame.data.value}); break;}
                case "rdx": {this.props.setReg({reg: "rdx", value: frame.data.value}); break;}
                case "rsi": {this.props.setReg({reg: "rsi", value: frame.data.value}); break;}
                case "rdi": {this.props.setReg({reg: "rdi", value: frame.data.value}); break;}
                case "rsp": {this.props.setReg({reg: "rsp", value: frame.data.value}); break;}
                case "rbp": {this.props.setReg({reg: "rbp", value: frame.data.value}); break;}
                case "rip": {this.props.setReg({reg: "rip", value: frame.data.value}); break;}
                case "r8": {this.props.setReg({reg: "r8", value: frame.data.value}); break;}
                case "r9": {this.props.setReg({reg: "r9", value: frame.data.value}); break;}
                case "r10": {this.props.setReg({reg: "r10", value: frame.data.value}); break;}
                case "r11": {this.props.setReg({reg: "r11", value: frame.data.value}); break;}
                case "r12": {this.props.setReg({reg: "r12", value: frame.data.value}); break;}
                case "r13": {this.props.setReg({reg: "r13", value: frame.data.value}); break;}
                case "r14": {this.props.setReg({reg: "r14", value: frame.data.value}); break;}
                case "r15": {this.props.setReg({reg: "r15", value: frame.data.value}); break;}
                default: {}
            }
          }
        }

        this.setState({
            frames: curFrames,
        })
        if(frame.data.reg !== "rsp") {
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
            case "rax": {this.props.setReg({reg: "rax", value: frame.data.value}); break;}
            case "rbx": {this.props.setReg({reg: "rbx", value: frame.data.value}); break;}
            case "rcx": {this.props.setReg({reg: "rcx", value: frame.data.value}); break;}
            case "rdx": {this.props.setReg({reg: "rdx", value: frame.data.value}); break;}
            case "rsi": {this.props.setReg({reg: "rsi", value: frame.data.value}); break;}
            case "rdi": {this.props.setReg({reg: "rdi", value: frame.data.value}); break;}
            case "rsp": {this.props.setReg({reg: "rsp", value: frame.data.value}); break;}
            case "rbp": {this.props.setReg({reg: "rbp", value: frame.data.value}); break;}
            case "rip": {this.props.setReg({reg: "rip", value: frame.data.value}); break;}
            case "r8":  {this.props.setReg({reg: "r8",  value: frame.data.value}); break;}
            case "r9":  {this.props.setReg({reg: "r9",  value: frame.data.value}); break;}
            case "r10": {this.props.setReg({reg: "r10", value: frame.data.value}); break;}
            case "r11": {this.props.setReg({reg: "r11", value: frame.data.value}); break;}
            case "r12": {this.props.setReg({reg: "r12", value: frame.data.value}); break;}
            case "r13": {this.props.setReg({reg: "r13", value: frame.data.value}); break;}
            case "r14": {this.props.setReg({reg: "r14", value: frame.data.value}); break;}
            case "r15": {this.props.setReg({reg: "r15", value: frame.data.value}); break;}
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
            if(frame.address < this.props.register.rsp) {
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
        this.props.setReg({reg: "rbp", value: 4096});
        this.props.setReg({reg: "rsp", value: 4096});
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
                                {(this.props.register.rsp === frame.address && this.props.register.rbp === frame.address) ? 
                                        <Grid item>
                                            {this.decimalToHex(frame.address).map(char => char)}
                                            <Grid container className="StackAddress">
                                                <Grid item>
                                                    %rbp <ArrowRightAltIcon style = {{fontSize: "1vw"}}></ArrowRightAltIcon>
                                                </Grid>
                                                <Grid>
                                                    %rsp <ArrowRightAltIcon style = {{fontSize: "1vw"}}></ArrowRightAltIcon>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                :    
                                this.props.register.rsp === frame.address ?
                                        <Grid item>
                                            <Grid container className="StackAddress">
                                                <Grid item>
                                                    {this.decimalToHex(frame.address).map(char => char)}
                                                </Grid>
                                                <Grid item>
                                                    %rsp <ArrowRightAltIcon style = {{fontSize: "1vw"}}></ArrowRightAltIcon>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                :      
                                this.props.register.rbp === frame.address ?
                                    <Grid item>
                                        <Grid container className="StackAddress">
                                            <Grid item>
                                                {this.decimalToHex(frame.address).map(char => char)}
                                            </Grid>
                                            <Grid item>
                                                %rbp <ArrowRightAltIcon style = {{fontSize: "1vw"}}></ArrowRightAltIcon>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                : 
                                <Grid item>
                                    {this.decimalToHex(frame.address).map(char => char)}
                                </Grid>}

                            <Grid item>
                                <Framex86 params={frame} register={this.props.register}></Framex86>
                            </Grid>

                        </Grid>
                    )   
                }
                </Grid>
            </Grid>
        )
    }
}

export default Stackx86;