import React from 'react'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ControlTab from './ControlTab.js';
import Stack from './Stack';
import RegisterFileConfig from './RegisterFileConfig.js';
import Links from './Links.js';
import './../App.css';

class RegisterFile extends React.Component {
    constructor() {
        super();
        this.state = {
            register: {
                R0: 0,
                R1: 1,
                R2: 2,
                R3: 3,
                R4: 4,
                R5: 5,
                R6: 6,
                R7: 7,
                R8: 8,
                R9: 9,
                R10: 10,
                fp: 4096,
                R12: 12,
                sp: 4096,
                lr: 1,
                pc: 0
            },
            arm: true,
            decimal: true,
            operation: "",
            destination: "",
            src1: "",
            src2: "",
            immediate: 0,
        }
        this.incSp = this.incSp.bind(this);
        this.decSp = this.decSp.bind(this);
        this.setReg = this.setReg.bind(this);
        this.push = this.push.bind(this);
        this.pop = this.pop.bind(this);

    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    incSp = () => {
        let newReg = this.state.register;
        newReg.sp += 4;
        this.setState({
            register: newReg
        })
    }

    decSp = () => {
        let newReg = this.state.register;
        newReg.sp -= 4;
        this.setState({
            register: newReg
        })
    }

    toggleHex = () => {
        this.setState({
            decimal: !(this.state.decimal)
        })
    }

    getRegister = (reg) => {
        switch(reg) {
            case "R0": {return(this.state.register.R0);}
            case "R1": {return(this.state.register.R1);}
            case "R2": {return(this.state.register.R2);}
            case "R3": {return(this.state.register.R3);}
            case "R4": {return(this.state.register.R4);}
            case "R5": {return(this.state.register.R5);}
            case "R6": {return(this.state.register.R6);}
            case "R7": {return(this.state.register.R7);}
            case "R8": {return(this.state.register.R8);}
            case "R9": {return(this.state.register.R9);}
            case "R10": {return(this.state.register.R10);}
            case "fp": {return(this.state.register.fp);}
            case "R12": {return(this.state.register.R12);}
            case "sp": {return(this.state.register.sp);}
            case "lr": {return(this.state.register.lr);}
            case "pc": {return(this.state.register.pc);}
            default: {}
        }
    }

    setRegister = (reg, data, newReg) => {
        switch(reg) {
            case "R0": {newReg.R0 = data; break;}
            case "R1": {newReg.R1 = data; break;}
            case "R2": {newReg.R2 = data; break;}
            case "R3": {newReg.R3 = data; break;}
            case "R4": {newReg.R4 = data; break;}
            case "R5": {newReg.R5 = data; break;}
            case "R6": {newReg.R6 = data; break;}
            case "R7": {newReg.R7 = data; break;}
            case "R8": {newReg.R8 = data; break;}
            case "R9": {newReg.R9 = data; break;}
            case "R10": {newReg.R10 = data; break;}
            case "fp": {newReg.fp = data; break;}
            case "R12": {newReg.R12 = data; break;}
            case "sp": {newReg.sp = data; break;}
            case "lr": {newReg.lr = data; break;}
            case "pc": {newReg.pc = data; break;}
            default: {}
        }
    }

    setPc = (line) => {
        let newPc = this.state.register;
        newPc.pc = line;
        this.setState({
            register: newPc
        })
    }

    mov = (data) => {
        let arg2 = data.arg2;
        if(typeof data.arg2 === 'string' || data.arg2 instanceof String) {
            arg2 = this.getRegister(data.arg2);
        }
        
        let newReg = this.state.register;
        this.setRegister(data.arg1, arg2, newReg);
       
        this.setState({register: newReg});

        if(data.handleSp) {
            this.handleSpChild(this.state.register.sp);
        }

        this.removeFramesChild();
        // console.log(this.state.register);
    }

    add = (data) => {
        // console.log(data);
        let arg2 = this.getRegister(data.arg2);
        let arg3 = data.arg3;
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            arg3 = this.getRegister(data.arg3);
        }      

        // console.log(this.state.register);

        // console.log(arg2);
        // console.log(arg3);

        let sum = arg2+arg3;
        
        let newReg = this.state.register;
        this.setRegister(data.arg1, sum, newReg);

        if(data.handleSp) {
            this.handleSpChild(this.state.register.sp);
        }
        this.setState({register: newReg});

        this.removeFramesChild();
    }

    sub = (data) => {
        let arg2 = this.getRegister(data.arg2);
        let arg3 = data.arg3;
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            arg3 = this.getRegister(data.arg3);
        }   

        let difference = arg2-arg3;
        
        let newReg = this.state.register;
        this.setRegister(data.arg1, difference, newReg);

        if(data.handleSp) {
            this.handleSpChild(this.state.register.sp);
        }
        this.setState({register: newReg});

        this.removeFramesChild();
    }

    mult = (data) => {
        let arg2 = this.getRegister(data.arg2);
        let arg3 = data.arg3;
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            arg3 = this.getRegister(data.arg3);
        }   
        let product = arg2*arg3;
        
        let newReg = this.state.register;
        this.setRegister(data.arg1, product, newReg);

        if(data.handleSp) {
            this.handleSpChild(this.state.register.sp);
        }
        this.setState({register: newReg});

        this.removeFramesChild();
    }

    ldr = (data) => {
        let arg2 = data.arg2;
        let arg3 = data.arg3;
        if(typeof data.arg2 === 'string' || data.arg2 instanceof String) {
            // console.log("getting value");
            arg2 = this.getRegister(data.arg2);
        }  
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            // console.log("getting value");
            arg3 = this.getRegister(data.arg3);
        }   

        let address;
        if(arg3 === null) {
            address = arg2;
        }
        else {
            address = arg2 + arg3;
        }
        this.ldrChild({address: address, reg: data.arg1})
    }

    str = (data) => {
        let arg1 = this.getRegister(data.arg1);
        let arg2 = data.arg2;
        let arg3 = data.arg3;
        if(typeof data.arg2 === 'string' || data.arg2 instanceof String) {
            arg2 = this.getRegister(data.arg2);
        }  
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            arg3 = this.getRegister(data.arg3);
        }   
        let address;
        if(arg3 === null) {
            address = arg2;
        }
        else {
            address = arg2 + arg3;
        }
        this.strChild({address: address, value: arg1})
    }

    bl = (line) => {
        let newRegister = this.state.register;
        newRegister.lr = line;
        this.setRegister("lr", line, newRegister);
    }

    push = (data) => {
        if(typeof data === 'string' || data instanceof String) {
            this.pushChild(data);
        }
        else {
            let pushArray = [];
            if(data.arg1 !== "") {
                pushArray.push(data.arg1);
            }
            if(data.arg2 !== "") {
                pushArray.push(data.arg2);
            }
            if(data.arg3 !== "") {
                pushArray.push(data.arg3);
            }
            if(data.arg4 !== "") {
                pushArray.push(data.arg4);
            }
            if(data.arg5 !== "") {
                pushArray.push(data.arg5);
            }
            if(data.arg6 !== "") {
                pushArray.push(data.arg6);
            }
            pushArray = this.sort(pushArray, true);
            for(const register of pushArray) {
                this.pushChild(register);
            }
        }
    }

    pushFunction = (data) => {
        this.functionChild(data);
    }

    clearStack = () => {
        this.clearChild();
    }
    
    pop = (data) => {
        if(!(typeof data.arg1 === 'string' || data.arg1 instanceof String)) {
            this.popChild();
        }
        else {
            let popArray = [];
            if(data.arg1 !== "") {
                popArray.push(data.arg1);
            }
            if(data.arg2 !== "") {
                popArray.push(data.arg2);
            }
            if(data.arg3 !== "") {
                popArray.push(data.arg3);
            }
            if(data.arg4 !== "") {
                popArray.push(data.arg4);
            }
            if(data.arg5 !== "") {
                popArray.push(data.arg5);
            }
            if(data.arg6 !== "") {
                popArray.push(data.arg6);
            }
            popArray = this.sort(popArray, false);
            for(const register of popArray) {
                this.popRegChild(register);
            }
        }
    }

    bitwise = (data, func) => {
        let arg2 = this.getRegister(data.arg2);
        let arg3 = data.arg3;
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            arg3 = this.getRegister(data.arg3);
        }      

        // console.log(this.state.register);

        // console.log(arg2);
        // console.log(arg3);
        // console.log((arg2 >>> 0).toString(2));
        // console.log((arg3 >>> 0).toString(2));
        // console.log(func);
        let result;
        switch(func) {
            case "AND": {result = arg2&arg3; break}
            case "ORR": {result = arg2|arg3; break}
            case "EOR": {result = arg2^arg3; break}
            case "ASR": {result = arg2>>arg3; break}
            case "LSR": {result = arg2>>>arg3; break}
            case "LSL": {result = arg2<<arg3; break}
            default: {}
        }
        // console.log(result);
        // console.log((result >>> 0).toString(2));


        let newReg = this.state.register;
        this.setRegister(data.arg1, result, newReg);

        this.setState({register: newReg});

        this.removeFramesChild();
    }

    setReg = (data) => {
        let newReg = this.state.register;
        // console.log(data);
        
        switch(data.reg) {
            case "R0": {newReg.R0 = data.value; break;}
            case "R1": {newReg.R1 = data.value; break;}
            case "R2": {newReg.R2 = data.value; break;}
            case "R3": {newReg.R3 = data.value; break;}
            case "R4": {newReg.R4 = data.value; break;}
            case "R5": {newReg.R5 = data.value; break;}
            case "R6": {newReg.R6 = data.value; break;}
            case "R7": {newReg.R7 = data.value; break;}
            case "R8": {newReg.R8 = data.value; break;}
            case "R9": {newReg.R9 = data.value; break;}
            case "R10": {newReg.R10 = data.value; break;}
            case "fp": {newReg.fp = data.value; break;}
            case "R12": {newReg.R12 = data.value; break;}
            case "sp": {newReg.sp = data.value; break;}
            case "lr": {newReg.lr = data.value; break;}
            case "pc": {newReg.pc = data.value; break;}
            default: {}
        }

        this.setState({
            register: newReg
        })
        // console.log(this.state.register);
    }

    sort = (registers, backwards) => {
        let numReg = [];
        let newReg = [];
        // console.log(registers);
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
        // console.log(numReg);
        if(backwards) {
            numReg.sort((a,b)=>b-a);
        }
        else {
            numReg.sort((a,b)=>a-b);
        }

        // console.log(numReg);
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
        // console.log(newReg);
        return(newReg);
    }

    render() {
        return (
            <div>
                <Grid container className="AppComponents">

                    <Grid item style={{marginLeft: "2vw"}}>
                        <Grid container className="ControlHeader">
                            <Grid item>
                                <h1>Control</h1>
                            </Grid>
                            <Grid item>
                                <ControlTab register={this.state.register} mov={this.mov} add={this.add} sub={this.sub} mult={this.mult} push={this.push} pop={this.pop} ldr={this.ldr} str={this.str} bl={this.bl} setPc={this.setPc}  bitwise={this.bitwise} pushFunction={this.pushFunction} clear={this.clearStack}/>
                            </Grid>
                        </Grid>
                    </Grid>
                
                    <Grid item>
                        <Stack setPush={push => this.pushChild = push} setPop={pop => this.popChild = pop} setPopReg={pop => this.popRegChild = pop} setLdr={ldr => this.ldrChild = ldr} setStr={str => this.strChild = str} setSp={sp => this.handleSpChild = sp} setFunction={func => this.functionChild = func} setClear={clear => this.clearChild = clear} register={this.state.register} setRemoveFrames={frames => this.removeFramesChild = frames} incSp={this.incSp} decSp={this.decSp} setReg={this.setReg} setRegister={this.setRegister}/>
                    </Grid>

                    <Grid item>
                        <Grid container className="RightPanel">
                            <Grid item style={{marginRight: "2vw", width: "23vw"}}>
                                <Grid container className="RegisterFile">

                                    <Grid item className="RegHeading">
                                        <h1>
                                            Register File
                                        </h1>
                                    </Grid>

                                    <Grid item>
                                        <Button style = {{fontSize: "0.7vw", boxShadow: "0 0 0 0", borderRadius: "0.5vw", minWidth: "7vw", minHeight: "3vw", width: "7vw", height: "3vw"}} variant="contained" color="primary" onClick={this.toggleHex}>{this.state.decimal ? <h3>Hex</h3> : <h3>Dec</h3>}</Button>
                                    </Grid>

                                    <Grid item>
                                        <RegisterFileConfig register={this.state.register} decimal={this.state.decimal}/>
                                    </Grid>

                                </Grid>
                            </Grid>

                            <Grid item>
                                <Links/>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </div>

        )
    }
}

export default RegisterFile;