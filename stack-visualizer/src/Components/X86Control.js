import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import X86ControlTab from './X86ControlTab.js';
import Stackx86 from './Stackx86.js';
import RegisterFileConfigx86 from './RegisterFileConfigx86.js';
import Links from './Links.js';
// import Button from '@material-ui/core/Button';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
// import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import './../App.css';

class X86Control extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register: {
          rax: 0,
          rbx: 1,
          rcx: 2,
          rdx: 3,
          rsi: 4,
          rdi: 5,
          rsp: 4096,
          rbp: 4096,
          rip: 1,
          r8: 8,
          r9: 9,
          r10: 10,
          r11: 11,
          r12: 12,
          r13: 13,
          r14: 14,
          r15: 15
      },
      arm: false,
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

  incSp = () => {
    let newReg = this.state.register;
    newReg.rsp += 8;
    this.setState({
        register: newReg
    })
  }

  decSp = () => {
      let newReg = this.state.register;
      newReg.rsp -= 8;
      this.setState({
          register: newReg
      })
  }

  setReg = (data) => {
    let newReg = this.state.register;
    // console.log(data);
    
    switch(data.reg) {
        case "rax": {newReg.rax = data.value; break;}
        case "rbx": {newReg.rbx = data.value; break;}
        case "rcx": {newReg.rcx = data.value; break;}
        case "rdx": {newReg.rdx = data.value; break;}
        case "rsi": {newReg.rsi = data.value; break;}
        case "rdi": {newReg.rdi = data.value; break;}
        case "rsp": {newReg.rsp = data.value; break;}
        case "rbp": {newReg.rbp = data.value; break;}
        case "rip": {newReg.rip = data.value; break;}
        case "r8": {newReg.r8 = data.value; break;}
        case "r9": {newReg.r9 = data.value; break;}
        case "r10": {newReg.r10 = data.value; break;}
        case "r11": {newReg.r11 = data.value; break;}
        case "r12": {newReg.r12 = data.value; break;}
        case "r13": {newReg.r13 = data.value; break;}
        case "r14": {newReg.r14 = data.value; break;}
        case "r15": {newReg.r15 = data.value; break;}
        default: {}
    }

    this.setState({
        register: newReg
    })
    // console.log(this.state.register);
  }

  setRegister = (reg, data, newReg) => {
    switch(reg) {
        case "rax": {newReg.rax = data; break;}
        case "rbx": {newReg.rbx = data; break;}
        case "rcx": {newReg.rcx = data; break;}
        case "rdx": {newReg.rdx = data; break;}
        case "rsi": {newReg.rsi = data; break;}
        case "rdi": {newReg.rdi = data; break;}
        case "rsp": {newReg.rsp = data; break;}
        case "rbp": {newReg.rbp = data; break;}
        case "rip": {newReg.rip = data; break;}
        case "r8": {newReg.r8 = data; break;}
        case "r9": {newReg.r9 = data; break;}
        case "r10": {newReg.r10 = data; break;}
        case "r11": {newReg.r11 = data; break;}
        case "r12": {newReg.r12 = data; break;}
        case "r13": {newReg.r13 = data; break;}
        case "r14": {newReg.r14 = data; break;}
        case "r15": {newReg.r15 = data; break;}
        default: {}
    }
  }

  getRegister = (reg) => {
    switch(reg) {
        case "rax": {return(this.state.register.rax);}
        case "rbx": {return(this.state.register.rbx);}
        case "rcx": {return(this.state.register.rcx);}
        case "rdx": {return(this.state.register.rdx);}
        case "rsi": {return(this.state.register.rsi);}
        case "rdi": {return(this.state.register.rdi);}
        case "rsp": {return(this.state.register.rsp);}
        case "rbp": {return(this.state.register.rbp);}
        case "rip": {return(this.state.register.rip);}
        case "r8": {return(this.state.register.r8);}
        case "r9": {return(this.state.register.r9);}
        case "r10": {return(this.state.register.r10);}
        case "r11": {return(this.state.register.r11);}
        case "r12": {return(this.state.register.r12);}
        case "r13": {return(this.state.register.r13);}
        case "r14": {return(this.state.register.r14);}
        case "r15": {return(this.state.register.r15);}
        default: {}
    }
  }

  push = (data) => {
    if(typeof data === 'string' || data instanceof String) {
      this.pushChild(data);
    } else if(data.arg2 === "") {
      this.pushChild(data.arg1);
    }
    else {
        let pushArray = [];
        if(data.arg1 !== "") {
            //console.log(data.arg1);
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
            //console.log(register);
            this.pushChild(register);
        }
    }
  }
  
  pop = (data) => {
    console.log(data.arg6);
    if(!(typeof data.arg1 === 'string' || data.arg1 instanceof String)) {
        console.log("pop child false");
        this.popChild(false);
    } else if(data.arg6 === true) {
      console.log("pop child true");
      this.popChild(true);
    }
    else {
        console.log("pop reg child");
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

  pushFunction = (data) => {
    this.functionChild(data);
  }

  clearStack = () => {
      this.clearChild();
  }

  toggleHex = () => {
    this.setState({
        decimal: !(this.state.decimal)
    })
  }

  sort = (registers, backwards) => {
    let numReg = [];
    let newReg = [];
    // console.log(registers);
    for(const register of registers) {
        switch(register) {
            case "rax": {numReg.push(0); break;}
            case "rbx": {numReg.push(1); break;}
            case "rcx": {numReg.push(2); break;}
            case "rdx": {numReg.push(3); break;}
            case "rsi": {numReg.push(4); break;}
            case "rdi": {numReg.push(5); break;}
            case "rsp": {numReg.push(6); break;}
            case "rbp": {numReg.push(7); break;}
            case "rip": {numReg.push(8); break;}
            case "r8": {numReg.push(9); break;}
            case "r9": {numReg.push(10); break;}
            case "r10": {numReg.push(11); break;}
            case "r11": {numReg.push(12); break;}
            case "r12": {numReg.push(13); break;}
            case "r13": {numReg.push(14); break;}
            case "r14": {numReg.push(15); break;}
            case "r15": {numReg.push(16); break;}
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
            case 0: {newReg.push("rax"); break;}
            case 1: {newReg.push("rbx"); break;}
            case 2: {newReg.push("rcx"); break;}
            case 3: {newReg.push("rdx"); break;}
            case 4: {newReg.push("rsi"); break;}
            case 5: {newReg.push("rdi"); break;}
            case 6: {newReg.push("rsp"); break;}
            case 7: {newReg.push("rbp"); break;}
            case 8: {newReg.push("rip"); break;}
            case 9: {newReg.push("r8"); break;}
            case 10: {newReg.push("r9"); break;}
            case 11: {newReg.push("r10"); break;}
            case 12: {newReg.push("r11"); break;}
            case 13: {newReg.push("r12"); break;}
            case 14: {newReg.push("r13"); break;}
            case 15: {newReg.push("r14"); break;}
            case 16: {newReg.push("r15"); break;}
            default: {}
        }
    }
    // console.log(newReg);
    return(newReg);
  }

  // Operations ///////////////////////////////////
  bitwise = (data, func) => {
    let arg1 = data.arg1;
    if(typeof data.arg1 === 'string' || data.arg1 instanceof String) {
      arg1 = this.getRegister(data.arg1);
    }
    let arg2val = this.getRegister(data.arg2);   

    // console.log(this.state.register);

    // console.log((arg2 >>> 0).toString(2));
    // console.log((arg3 >>> 0).toString(2));
    // console.log(func);
    let result;
    switch(func) {
        case "and": {result = arg2val&arg1; break}
        case "or":  {result = arg2val|arg1; break}
        case "xor": {result = arg2val^arg1; break}
        case "sar": {result = arg2val>>arg1; break}
        case "shr": {result = arg2val>>>arg1; break}
        case "sal": {result = arg2val<<arg1; break}
        default: {}
    }
    // console.log(result);
    // console.log((result >>> 0).toString(2));


    let newReg = this.state.register;
    this.setRegister(data.arg2, result, newReg);

    this.setState({register: newReg});

    this.removeFramesChild();
  }

  setPc = (line) => {
    let newPc = this.state.register;
    newPc.rip = line;
    this.setState({
        register: newPc
    })
  }

  mov = (data) => {
      let arg1 = data.arg1;
      if(typeof data.arg1 === 'string' || data.arg1 instanceof String) {
        arg1 = this.getRegister(data.arg1);
      }
      
      let newReg = this.state.register;
      this.setRegister(data.arg2, arg1, newReg);
    
      this.setState({register: newReg});

      if(data.handleSp) {
          this.handleSpChild(this.state.register.rsp);
      }

      this.removeFramesChild();
      // console.log(this.state.register);
  }

  add = (data) => {
      //console.log(data);
      let arg1 = data.arg1;
      if(typeof data.arg1 === 'string' || data.arg1 instanceof String) {
          arg1 = this.getRegister(data.arg1);
      }
      let arg2val = this.getRegister(data.arg2);

      //console.log(this.state.register);

      //console.log(arg1);
      //console.log(arg2val);

      let sum = arg1 + arg2val;
      
      let newReg = this.state.register;
      this.setRegister(data.arg2, sum, newReg);
      //console.log(newReg)

      if(data.handleSp) {
          this.handleSpChild(this.state.register.rsp);
      }
      this.setState({register: newReg});

      this.removeFramesChild();
  }

  sub = (data) => {
      let arg1 = data.arg1;
      if(typeof data.arg1 === 'string' || data.arg1 instanceof String) {
        arg1 = this.getRegister(data.arg1);
      }
      let arg2val = this.getRegister(data.arg2);

      let difference = arg2val-arg1;
      
      let newReg = this.state.register;
      this.setRegister(data.arg2, difference, newReg);

      if(data.handleSp) {
          this.handleSpChild(this.state.register.rsp);
      }
      this.setState({register: newReg});

      this.removeFramesChild();
  }

  mult = (data) => {
      let arg1 = data.arg1;
      if(typeof data.arg1 === 'string' || data.arg1 instanceof String) {
        arg1 = this.getRegister(data.arg1);
      }
      let arg2val = this.getRegister(data.arg2);

      let product = arg2val*arg1;
      
      let newReg = this.state.register;
      this.setRegister(data.arg2, product, newReg);

      if(data.handleSp) {
          this.handleSpChild(this.state.register.rsp);
      }
      this.setState({register: newReg});

      this.removeFramesChild();
  }

  ldr = (data) => {
      let arg1 = data.arg1;
      //let arg2 = data.arg2;
      let arg3 = data.arg3;
      if(typeof data.arg1 === 'string' || data.arg1 instanceof String) {
          // console.log("getting value");
          arg1 = this.getRegister(data.arg1);
      }  
      //if(typeof data.arg2 === 'string' || data.arg2 instanceof String) {
      //    // console.log("getting value");
      //    arg2 = this.getRegister(data.arg2);
      //}   

      let address;
      if(arg3 === null) {
          address = arg1;
      }
      else {
          address = arg1 + arg3;
      }
      this.ldrChild({address: address, reg: data.arg2})
  }

  str = (data) => {
      let arg1 = data.arg1;
      let arg2 = data.arg2;
      let arg3 = data.arg3;
      if(typeof data.arg1 === 'string' || data.arg1 instanceof String) {
        arg1 = this.getRegister(data.arg1);
      }
      if(typeof data.arg2 === 'string' || data.arg2 instanceof String) {
          arg2 = this.getRegister(data.arg2);
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
                      <X86ControlTab register={this.state.register} mov={this.mov} add={this.add} sub={this.sub} mult={this.mult} push={this.push} pop={this.pop} ldr={this.ldr} str={this.str} bl={this.bl} setPc={this.setPc}  bitwise={this.bitwise} pushFunction={this.pushFunction} clear={this.clearStack}/>
                  </Grid>
              </Grid>
          </Grid>

          <Grid item>
              <Stackx86 setPush={push => this.pushChild = push} setPop={pop => this.popChild = pop} setPopReg={pop => this.popRegChild = pop} setLdr={ldr => this.ldrChild = ldr} setStr={str => this.strChild = str} setSp={rsp => this.handleSpChild = rsp} setFunction={func => this.functionChild = func} setClear={clear => this.clearChild = clear} register={this.state.register} setRemoveFrames={frames => this.removeFramesChild = frames} incSp={this.incSp} decSp={this.decSp} setReg={this.setReg} setRegister={this.setRegister}/>
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
                            <RegisterFileConfigx86 register={this.state.register} decimal={this.state.decimal}/>
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

export default X86Control;