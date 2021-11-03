import React from 'react';
import TextField from "@material-ui/core/TextField";
import Highlight from 'react-highlighter';
import RunOptions from './../Compile Components/RunOptions.js';
import SampleCodex86 from './SampleCodex86.js';
import InputAdornment from '@material-ui/core/InputAdornment';
// import Button from '@material-ui/core/Button';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
// import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import './../../App.css';

class Parserx86 extends React.Component {
    constructor() {
        super();
        this.state = {
            code: "",
            line: 0,
            status: 0,
            step: false,
            visualize: false,
            speed: 4,
            lines: [], 
            debugCode: "",
            nextInstruction: "",
            numLines: 0,
            breakpoints: [],
            lineNum: 2
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
        let count = 0;
        for(let i = 0; i < e.target.value.length; i++) {
            if(e.target.value.substring(i, i+1) === '\n') {
                count++;
            }
        }
        this.setState({
            numLines: count
        })
    }

    hexToInt = (hex) => {
        // console.log("HEXNUM: " + hex);
        while(hex.length < 16) {
            hex = "0" + hex;
        }
        //console.log(hex)
        var num = parseInt(hex, 16);
        //console.log(num)
        var maxVal = Math.pow(2, hex.length / 2 * 8);
        if (num > maxVal / 2 - 1) {
            num = num - maxVal;
        }
        return num;
    }

    listedLinesCalc = (numLines) => {
        let lineArray = [" 1  \n"," 2\n"," 3\n"," 4\n"," 5\n"," 6\n"," 7\n"," 8\n"," 9\n","10\n"];
        for(let i = 11; i < numLines+2; i++) {
            if(i <= 100) {
                lineArray.push(i + "\n");
            }
        }
        return lineArray;
    }

    genCode = (code) => {
        let sampleCode = code;
        this.setState({
            code: sampleCode
        })
        let count = 0;
        for(let i = 0; i < code.length; i++) {
            if(code.substring(i, i+1) === '\n') {
                count++;
            }
        }
        this.setState({
            numLines: count,
        })
    }

    // addBreakpoint = (line, change) => {
    //     let newBreakpoints = this.state.breakpoints;
    //     line = parseInt(line);
    //    console.log(line);
    //     if(change) {
    //         newBreakpoints.push(line);
    //     }
    //     else {
    //         for(let i = 0; i < newBreakpoints.length; i++) {
    //             if(newBreakpoints[i] === line) {
    //                 newBreakpoints.splice(i, i+1);
    //             }
    //         }
    //     }
    //     this.setState({
    //         breakpoints: newBreakpoints
    //     })
    //    console.log(newBreakpoints);
    // }

    startStep = ()  => {
        this.props.clear()
        this.setState({
            step: true
        })
        if(this.state.code === "") {
            this.handleReset();
        }
        this.pointCurInstruction();
    }

    handleStep = () => {
        this.parse(true);
        this.pointCurInstruction();
    }

    handleRun = () => {
        this.parse(false);
    }

    handleContinue = () => {
        this.handleStep();
        this.setState({
            step: false
        })
        this.startVisualize();
    }

    handleVisualize = () => {
        this.pointCurInstruction();
        this.parse(true);
    }

    startVisualize = () => {
        this.props.clear()
        this.setState({
            visualize: true
        })
        if(this.state.code === "") {
            this.handleReset();
        }
        this.pointCurInstruction();
    }

    handleReset = () => {
        // console.log("RESETTING");
        this.setState({
            line: 0,
            status: 0,
            step: false,
            speed: 4,
            lines: [],
            visualize: false,
            nextInstruction: "",
        })
        //this.props.clear();
    }

    changeSpeed = (newSpeed) => {
        this.setState({
            speed: newSpeed
        })
    }

    pointCurInstruction = (curLine) => {
        // console.log(curLine);
        let lineNum;
        let passFirst = false;  // If we want to jump to a line to highlight with a breakpoint, skip highlighting the first line
        if (typeof curLine !== 'undefined') {
            lineNum = curLine;
            passFirst = true;
        }
        else {
            lineNum = this.state.line;
        }
        // console.log(lineNum);
        let debugCode = "";
        let nextInstruction = "";
        let addStart = false;
        let branch = false;
        let lines = this.getLines();
        let instructionData = this.getInstructions(lines);

        let branchData = [{label: null, instruction: null, arg1: null}];

        for(const instruction of instructionData.instructions) {
            if(instruction.line === lineNum) {
                if(instruction.instruction !== null) {
                    branchData[0].instruction = instruction.instruction;
                }
                if(instruction.arg1 !== null) {
                    branchData[0].arg1 = instruction.arg1;
                }
            }
        }
        //console.log(branchData[0]);
        //console.log(instructionData.labels);

        // If the instruction is a branch, we must highlight where it will branch to
        let instruction = branchData[0].instruction;
        if(instruction === "jmp" || (instruction === "jne" && this.state.status !== 0) || (instruction === "je" && this.state.status === 0) || (instruction === "jg" && this.state.status === 1) || (instruction === "jl" && this.state.status === -1) || (instruction === "jge" && this.state.status !== -1) || (instruction === "jle" && this.state.status !== 1) || instruction === "call" || instruction === "ret") {
            branch = true;
            let line;
            if(instruction === "ret") {
              line = this.getRegister("rip") - 1;
            } else {
              line = this.branch(branchData, instructionData.labels);
            }
            for(let i = 0; i < lines.length; i++) {
                let curLine = lines[i];
                if(i === line) {
                    nextInstruction = (i+1) + ". " + curLine + "\n";
                    debugCode += (i+1) + ". " + curLine + "\n";
                }
                else {
                    if(i+1 < 10) {
                        debugCode += (i+1) + "  " + curLine + "\n";
                    }
                    else {
                        debugCode += (i+1) + " " + curLine + "\n";
                    }
                }
            }
        }

        if(!(lineNum === lines.length - 1) && !branch) {
            for(let i = 0; i < lines.length; i++) {
                let curLine = lines[i];
                if(this.state.nextInstruction === "" && i === 0 && !passFirst) {
                    nextInstruction = (i+1) + ". " + curLine + "\n";
                    debugCode += (i+1) + ". " + curLine + "\n";
                    addStart = true;
                }
                else if(i === lineNum + 1 && !addStart) {
                    nextInstruction = (i+1) + ". " + curLine + "\n";
                    debugCode += (i+1) + ". " + curLine + "\n";
                }
                else {
                    if(i+1 < 10) {
                        debugCode += (i+1) + "  " + curLine + "\n";
                    }
                    else {
                        debugCode += (i+1) + " " + curLine + "\n";
                    }
                }
            }
        }

        // if there is only one instruction, highlight it
        if(lineNum === 0 && lines.length === 1) {
            nextInstruction = "1. " + lines[0] + "\n";
            debugCode += "1. " + lines[0] + "\n";
        }        

        // console.log(nextInstruction);
        
        this.setState({
            debugCode: debugCode,
            nextInstruction: nextInstruction
        })
    }

    getRegister = (reg) => {
        switch(reg) {
            case "rax": {return(this.props.register.rax);}
            case "rbx": {return(this.props.register.rbx);}
            case "rcx": {return(this.props.register.rcx);}
            case "rdx": {return(this.props.register.rdx);}
            case "rsi": {return(this.props.register.rsi);}
            case "rdi": {return(this.props.register.rdi);}
            case "rsp": {return(this.props.register.rsp);}
            case "rbp": {return(this.props.register.rbp);}
            case "rip": {return(this.props.register.rip);}
            case "r8": {return(this.props.register.r8);}
            case "r9": {return(this.props.register.r9);}
            case "r10": {return(this.props.register.r10);}
            case "r11": {return(this.props.register.r11);}
            case "r12": {return(this.props.register.r12);}
            case "r13": {return(this.props.register.r13);}
            case "r14": {return(this.props.register.r14);}
            case "r15": {return(this.props.register.r15);}
            default: {}
        }
    }

    parse = (step) => {
        let lines = this.getLines();
        let instructionData = this.getInstructions(lines);
        this.executeInstructions(instructionData.instructions, instructionData.instructionLines, instructionData.labels, step);
    }

    getLines = () => {
        let lines = [];
        let code = this.state.code;
        // console.log(this.state.code);
        let begin = 0;

        for(let i = 0; i < code.length; i++) {
            if(code.substring(i, i+1) === '\n') {
                lines.push(code.substring(begin, i) + " ");
                begin = i+1;
            }
        }
        lines.push(code.substring(begin, code.length) + " ");
        
        for(let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if(!(/\S/.test(line))) {
                lines.splice(i, 1);
                i--;
            }
        }

        // console.log(lines);
        let newLines = this.state.lines;
        newLines = lines;
        this.setState({
            lines: newLines
        })

        return(lines);
    }

    getInstructions = (lines) => {
        let instructions = [];
        let instructionCount = 0;
        let begin = 0;
        for(let i = 0; i < lines.length; i++) {
            begin = 0;
            instructionCount = 0;
            let line = lines[i];
            for(let j = 0; j < line.length; j++) {
                if(/\s/.test(line.substring(j, j+1))) {
                    switch(instructionCount) {
                        case 0: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, instruction: line.substring(begin, j-1).replace(/\s/g, ""), label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(j-1, j) === ":") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: line.substring(begin, j-1).replace(/\s/g, "")});
                                begin = j+1;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: null, arg6: null, instruction: line.substring(begin, j).replace(/\s/g, ""), label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 1: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: line.substring(begin, j-1).replace(/\s/g, ""), arg2: null, arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: line.substring(begin, j).replace(/\s/g, ""), arg2: null, arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 2: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: line.substring(begin, j-1).replace(/\s/g, ""), arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: line.substring(begin, j).replace(/\s/g, ""), arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 3: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: line.substring(begin, j-1).replace(/\s/g, ""), arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: line.substring(begin, j).replace(/\s/g, ""), arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 4: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: line.substring(begin, j-1).replace(/\s/g, ""), arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: line.substring(begin, j).replace(/\s/g, ""), arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 5: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: line.substring(begin, j-1).replace(/\s/g, ""), arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: line.substring(begin, j).replace(/\s/g, ""), arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 6: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: null, arg6: line.substring(begin, j-1).replace(/\s/g, ""), instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: null, arg6: line.substring(begin, j).replace(/\s/g, ""), instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        default: {}
                    }
                }
            }
        }

        let curLine = 0;
        let instructionLines = [0];
        let labels = [];
        for(let i = 0; i < instructions.length; i++) {
            let elem = instructions[i];
            if(elem.line !== curLine) {
                instructionLines.push(i);
                curLine++;
            }
            if(elem.label !== null) {
                labels.push(elem);
            }
        }

        //console.log(labels);
        //console.log(instructions);

        let returnData = {instructions: instructions, instructionLines: instructionLines, labels: labels};
        return(returnData);
    }

    executeInstructions = (instructions, instructionLines, labels, step) => {
        let line = 0;
        let begin = 0;
        let type = "";
        let status = 0;
        let newInstructions = [];
        let instructionCount = 0;
        // console.log("Step State: " + step);

        if(step) {
            let curLine = this.state.line;
            //console.log("line: " + curLine);
            for(let i = 0; i < instructions.length; i++) {
                let elem = instructions[i];
                if(elem.line === curLine) {
                    newInstructions.push(elem);
                }
            }
            instructions = newInstructions;
            line = curLine;
        }
        // console.log(instructions);

rLoop:  for(let i = 0; i < instructions.length; i++) {
            let elem = instructions[i];
            if((elem.line !== line) || (i === instructions.length - 1)) {
                if(i === instructions.length - 1) {
                    //console.log("Incrementing i");
                    i++;
                    if((elem.instruction !== null) && ((this.correctInstCase(elem.instruction) === "ret") || (this.correctInstCase(elem.instruction) === "leave"))) {
                      type = this.correctInstCase(elem.instruction);
                    }
                }

                // When stepping/visualizing, if there is a label on a line by itself, move to the next line
                if(type === "") {
                    line++;
                }

                // If there is a breakpoint on the line about to be executed, enter step
                // if(this.state.breakpoints.includes(line+1) && !step) {
                //     this.setState({
                //         step: true
                //     })
                //     this.pointCurInstruction(line-1);  
                //     return;
                // }

                type = this.correctInstCase(type);
                switch(type) {
                    case "add": {
                        let error = this.add(instructions.slice(begin, i));
                        if(!error) {
                            this.handleReset();
                            return;
                        }
                        this.props.setPc(line+2);
                        begin = i;
                        line++;
                        break;
                    }
                    case "sub": {
                        let error = this.sub(instructions.slice(begin, i));
                        if(!error) {
                            this.handleReset();
                            return;
                        }
                        this.props.setPc(line+2);
                        begin = i;
                        line++;
                        break;
                    }
                    case "imul": {
                        let error = this.mul(instructions.slice(begin, i));
                        if(!error) {
                            this.handleReset();
                            return;
                        }
                        this.props.setPc(line+2);
                        begin = i;
                        line++;
                        break;
                    }
                    case "mov": {
                        let movInst = instructions.slice(begin, i);
                        let arg1 = "";
                        let arg2 = "";
                        for(const elem of movInst) {
                          if(elem.arg1 !== null) {
                            arg1 = elem.arg1;
                          }
                          if(elem.arg2 !== null) {
                            arg2 = elem.arg2;
                          }
                        }
                        let error = false;
                        if((arg1 !== null) && (arg1.substring(arg1.length-1, arg1.length) === ")")) {
                            this.ldr(movInst);
                        } else if((arg2 !== null) && (arg2.substring(arg2.length-1, arg2.length) === ")")) {
                          this.str(movInst);
                        } else {
                          error = this.mov(instructions.slice(begin, i));
                        }
                        if(error) {
                            this.handleReset();
                            return;
                        }
                        this.props.setPc(line+2);
                        begin = i;
                        line++;
                        break;
                    }
                    case "cmp": {
                      this.props.setPc(line+2);
                      status = this.cmp(instructions.slice(begin, i));
                      console.log("status");
                      console.log(status);
                      this.setState({
                          status: status
                      })
                      // console.log("Status: " + status);
                      begin = i;
                      line++;
                      break;
                  }
                    case "jmp": {
                        // console.log("Branch");
                        line = this.branch(instructions.slice(begin, i), labels);
                        if(!step) {
                            i = instructionLines[line];
                        }
                        begin = i;
                        this.props.setPc(line+2);
                        // console.log(line);
                        // console.log(i);
                        break;
                    }
                    case "jg": {
                        if(step) {
                            status = this.state.status
                        }
                        // console.log("status: " + status);
                        if(status === 1) {
                            // console.log("BGT Branching");
                            line = this.branch(instructions.slice(begin, i), labels);
                            if(!step) {
                                i = instructionLines[line];
                            }
                            // console.log(line);
                            // console.log(i);
                            begin = i;
                            this.props.setPc(line+2);
                        }
                        else {
                            this.props.setPc(line+2);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "jl": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(status === -1) {
                            line = this.branch(instructions.slice(begin, i), labels);
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+2);
                        }
                        else {
                            this.props.setPc(line+2);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "je": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(status === 0) {
                            line = this.branch(instructions.slice(begin, i), labels);                      
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+2);
                        }
                        else {
                            this.props.setPc(line+2);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "jne": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(!(status === 0)) {
                            line = this.branch(instructions.slice(begin, i), labels);                   
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+2);
                        }
                        else {
                            this.props.setPc(line+2);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "jge": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(!(status === -1)) {
                            line = this.branch(instructions.slice(begin, i), labels);                     
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+2);
                        }
                        else {
                            this.props.setPc(line+2);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "jle": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(!(status === 1)) {
                            line = this.branch(instructions.slice(begin, i), labels);                   
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+2);
                        }
                        else {
                            this.props.setPc(line+2);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "call": {
                        let pushData = {arg1: line+2, arg2: "", arg3: "", arg4: "", arg5: "", arg6: ""};
                        this.props.push(pushData);
                        line = this.branch(instructions.slice(begin, i), labels);  
                        this.props.setPc(line+2);
                        if(!step) {
                            i = instructionLines[line];
                        }
                        begin = i;
                        break;
                    }
                    case "ret": {
                      let popData = {arg1: "ret", arg2: null, arg3: null, arg4: null, arg5: null, arg6: true};
                      this.props.pop(popData);
                      line = this.getRegister("rip") - 1;
                      if(!step) {
                          i = instructionLines[line];
                      }
                      begin = i;
                      break;
                  }
                    case "leave": {
                        let movData = {arg1: "rbp", arg2: "rsp", handleSp: true};
                        this.props.mov(movData);
                        let popData = {arg1: "rbp", arg2: "", arg3: "", arg4: "", arg5: "", arg6: ""};
                        this.props.pop(popData);
                        this.props.setPc(line+2);
                        begin = i;
                        line++;
                        break;
                    }
                    case "push": {
                        this.push(instructions.slice(begin, i));
                        this.props.setPc(line+2);
                        begin = i;
                        line++;
                        break;
                    }
                    case "pop": {
                        this.pop(instructions.slice(begin, i));
                        this.props.setPc(line+2);
                        begin = i;
                        line++;
                        break;
                    }
                    case "and": {
                        this.bitwise(instructions.slice(begin, i), "and");
                        this.props.setPc(line+2);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "or": {
                        this.bitwise(instructions.slice(begin, i), "or");
                        this.props.setPc(line+2);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "xor": {
                        this.bitwise(instructions.slice(begin, i), "xor");
                        this.props.setPc(line+2);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "sar": {
                        this.bitwise(instructions.slice(begin, i), "sar");
                        this.props.setPc(line+2);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "shr": {
                        this.bitwise(instructions.slice(begin, i), "shr");
                        this.props.setPc(line+2);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "sal": {
                        this.bitwise(instructions.slice(begin, i), "sal");
                        this.props.setPc(line+2);
                        begin = i; 
                        line++;
                        break;
                    }
                    default: {
                        if(type !== "") {
                            this.handleReset();
                            alert("Instruction '" + type +  "' not recognized");
                            break rLoop;
                        }
                    }
                }
            }

            this.setState({
                line: line,
            })
            instructionCount++;
            // console.log("TOTALINSTRUCTIONS: " + instructionCount)
            if(instructionCount > 100000) {
                this.handleReset(); 
                alert("Infinite loop or running took too long");
                break;
            }

            if(i <= instructions.length - 1) {
                elem = instructions[i];
            }

            // When running, if there is a label on a line by itself, meaning the next instruction is a label/instruction, move to the next line
            if(elem.label !== null && !(i === instructions.length) && !(this.state.step) && !(this.state.visualize) && i+1 < instructions.length && instructions[i+1].arg1 === null) {
                //console.log("SETTING TYPE TO NULL");
                type = "";
            }
            if(elem.instruction !== null) {
                //console.log("SETTING TYPE TO: " + elem.instruction);
                type = elem.instruction;
            }
        }
        
        if(line === this.state.lines.length) {
            this.handleReset();
        }

        if(!(this.state.step) && !(this.state.visualize)) {
            this.handleReset();
        }

    }

    mov = (data) => {
        // console.log("move");
        let arg1 = "";
        let arg2 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
        }
        if(arg1.substring(0, 1) === "$") {
            if (arg1.substring(1, 3) === "0x") {
              arg1 = this.hexToInt(arg1.substring(3, arg1.length));
            }
            else { 
              arg1 = parseInt(arg1.substring(1, arg1.length));
            }
        }

        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        let validNum = this.checkNumber(arg1);
        if(!validNum) {
            return true;
        }

        let movData = {arg1: arg1, arg2: arg2, handleSp: false};

        if(arg2 === "rsp") {
            movData = {arg1: arg1, arg2: arg2, handleSp: true};
        }
        // console.log(movData);
        this.props.mov(movData);
        return false;
    }

    add = (data) => {
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                arg3 = elem.arg3;
            }
        }    
        if(arg1.substring(0, 1) === "$") {
            if (arg1.substring(1, 3) === "0x") {
              arg1 = this.hexToInt(arg1.substring(3, arg1.length));
            }
            else { 
              arg1 = parseInt(arg1.substring(1, arg1.length));
            }
        }

        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        arg3 = this.correctRegCase(arg3);
        let validNum1 = this.checkNumber(arg1);
        if(!validNum1) {
            return false;
        }

        let addData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg2 === "rsp") {
            addData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: true};
        }
        //console.log("add: " + "arg1: " + arg1 + " arg2 : " + arg2 + " arg3: " + arg3);
        this.props.add(addData);
        return true;
    }

    sub = (data) => {
        // console.log("sub");
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                arg3 = elem.arg3;
            }
        }    
        if(arg1.substring(0, 1) === "$") {
            if (arg1.substring(1, 3) === "0x") {
              arg1 = this.hexToInt(arg1.substring(3, arg1.length));
            }
            else { 
              arg1 = parseInt(arg1.substring(1, arg1.length));
            }
        }
        // console.log(arg3);

        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        arg3 = this.correctRegCase(arg3);
        let validNum1 = this.checkNumber(arg1);
        if(!validNum1) {
            return false;
        }

        let subData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg2 === "rsp") {
            subData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: true};
        }        
        // console.log(subData);
        this.props.sub(subData);
        return true;
    }

    mul = (data) => {
        // console.log("mul");
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                arg3 = elem.arg3;
            }
        }    
        if(arg1.substring(0, 1) === "$") {
            if (arg1.substring(1, 3) === "0x") {
              arg1 = this.hexToInt(arg1.substring(3, arg1.length));
            }
            else { 
              arg1 = parseInt(arg1.substring(1, arg1.length));
            }
        }

        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        arg3 = this.correctRegCase(arg3);
        let validNum1 = this.checkNumber(arg1);
        if(!validNum1) {
            return false;
        }

        let multData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg2 === "rsp") {
            multData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: true};
        }     
        this.props.mult(multData);
        return true;
    }

    cmp = (data) => {
        let arg1 = "";
        let arg2 = "";

        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
        }    
        if(arg1.substring(0, 1) === "$") {
            if (arg1.substring(1, 3) === "0x") {
              arg1 = this.hexToInt(arg1.substring(3, arg1.length));
            }
            else { 
              arg1 = parseInt(arg1.substring(1, arg1.length));
            }
        }
        else {
          arg1 = this.getRegister(this.correctRegCase(arg1));
        }

        arg2 = this.getRegister(this.correctRegCase(arg2));

        console.log("CMP: arg1: " + arg1 + " arg2: " + arg2);
        
        let newStatus = 0;
        if(arg2 > arg1) {
            newStatus = 1;
        }
        else if(arg1 === arg2) {
            newStatus = 0;
        }
        else {
            newStatus = -1;
        }
        
        return(newStatus);
    }

    branch = (data, labels) => {
        let name;
        let line;

        for(let j = 0; j < data.length; j++) {
            let instruction = data[j];
            if(instruction.arg1 !== null) {
                name = data[j].arg1;
            }
        }
        //console.log(name);
        //console.log(labels);

        if(isNaN(name)) {
            for(const label of labels) {
                if(name === label.label) {
                    line = label.line;
                }
            }
        }
        else {
            // if there is a label that is this number, use the label instead of the line number
            let existsLabel = false;
            for(const label of labels) {
                if(name === label.label) {
                    line = label.line;
                    existsLabel = true;
                }
            }
            if(!existsLabel) {
                line = (parseInt(name)) - 1;
            }
        }
        return(line);
    }

    bl = (line) => {
        this.props.bl(line);
    }
    
    bx = (reg) => {
        return(this.getRegister(reg));
    }

    push = (data) => {
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        let arg4 = "";
        let arg5 = "";
        let arg6 = "";
        // console.log(data);

        for(const elem of data) {
            if(typeof elem.arg1 === 'string' || data.arg1 instanceof String) {
                arg1 = elem.arg1;
                arg1 = arg1.replace("{", "");
                arg1 = arg1.replace("}", "");
            }
            if(typeof elem.arg2 === 'string' || data.arg1 instanceof String) {
                arg2 = elem.arg2;
                arg2 = arg2.replace("}", "");
            }
            if(typeof elem.arg3 === 'string' || data.arg1 instanceof String) {
                arg3 = elem.arg3;
                arg3 = arg3.replace("}", "");
            }
            if(typeof elem.arg4 === 'string' || data.arg1 instanceof String) {
                arg4 = elem.arg4;
                arg4 = arg4.replace("}", "");
            }
            if(typeof elem.arg5 === 'string' || data.arg1 instanceof String) {
                arg5 = elem.arg5;
                arg5 = arg5.replace("}", "");
            }
            if(typeof elem.arg6 === 'string' || data.arg1 instanceof String) {
                arg6 = elem.arg6;
                arg6 = arg6.replace("}", "");
            }
        }
        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        arg3 = this.correctRegCase(arg3);
        arg4 = this.correctRegCase(arg4);
        arg5 = this.correctRegCase(arg5);
        arg6 = this.correctRegCase(arg6);
        if(arg1.includes("-")) {
            let start = this.getNumberByRegister(this.correctRegCase(arg1.substring(0, arg1.indexOf("-"))));
            let end = this.getNumberByRegister(this.correctRegCase(arg1.substring(arg1.indexOf("-") + 1, arg1.length)));
            let count = 1
            for(let i = start; i <= end; i++) {
                switch(count) {
                    case 1: arg1 = this.getRegisterByNumber(i); break;
                    case 2: arg2 = this.getRegisterByNumber(i); break;
                    case 3: arg3 = this.getRegisterByNumber(i); break;
                    case 4: arg4 = this.getRegisterByNumber(i); break;
                    case 5: arg5 = this.getRegisterByNumber(i); break;
                    case 6: arg6 = this.getRegisterByNumber(i); break;
                    default:{}
                }
                count++;
            }
        } else {
          if(arg1.substring(0, 1) === "$") {
            if (arg1.substring(1, 3) === "0x") {
              arg1 = this.hexToInt(arg1.substring(3, arg1.length));
            }
            else { 
              arg1 = parseInt(arg1.substring(1, arg1.length));
            }
          }
        }
        let pushData = {arg1: arg1, arg2: arg2, arg3: arg3, arg4: arg4, arg5: arg5, arg6: arg6};

        this.props.push(pushData);
    }

    checkNumber = (num) => {
        if(this.getNumberByRegister(num) !== -1) {
            return true;
        }
        else if(isNaN(num)) {
            alert("Invalid Number");
            return false;
        }
        else if(num > (2**63)-1 || num < -(2**63)) {
            alert("Number exceeds 64 bits");
            return false;
        }
        else {
            return true;
        }
    }

    correctInstCase = (inst) => {
        let upper = inst.toString().toLowerCase();
        switch(upper) {
            case "and": return "and";
            case "andq": return "and";
            case "andl": return "and";
            case "andw": return "and";
            case "andb": return "and";
            case "or": return "or";
            case "orq": return "or";
            case "orl": return "or";
            case "orw": return "or";
            case "orb": return "or";
            case "xor": return "xor";
            case "xorq": return "xor";
            case "xorl": return "xor";
            case "xorw": return "xor";
            case "xorb": return "xor";
            case "sar": return "sar";
            case "sarq": return "sar";
            case "sarl": return "sar";
            case "sarw": return "sar";
            case "sarb": return "sar";
            case "shr": return "shr";
            case "shrq": return "shr";
            case "shrl": return "shr";
            case "shrw": return "shr";
            case "shrb": return "shr";
            case "sal": return "sal";
            case "salq": return "sal";
            case "sall": return "sal";
            case "salw": return "sal";
            case "salb": return "sal";
            case "shl": return "sal";
            case "shlq": return "sal";
            case "shll": return "sal";
            case "shlw": return "sal";
            case "shlb": return "sal";
            case "mov": return "mov";
            case "movq": return "mov";
            case "movl": return "mov";
            case "movw": return "mov";
            case "movb": return "mov";
            case "add": return "add";
            case "addq": return "add";
            case "addl": return "add";
            case "addw": return "add";
            case "addb": return "add";
            case "sub": return "sub";
            case "subq": return "sub";
            case "subl": return "sub";
            case "subw": return "sub";
            case "subb": return "sub";
            case "imul": return "imul";
            case "imulq": return "imul";
            case "imull": return "imul";
            case "imulw": return "imul";
            case "imulb": return "imul";
            case "push": return "push";
            case "pushq": return "push";
            case "pop": return "pop";
            case "popq": return "pop";
            case "cmp": return "cmp";
            case "cmpq": return "cmp";
            case "cmpl": return "cmp";
            case "cmpw": return "cmp";
            case "cmpb": return "cmp";
            case "jmp": return "jmp";
            case "je": return "je";
            case "jne": return "jne";
            case "jg": return "jg";
            case "jnle": return "jg";
            case "jl": return "jl";
            case "jnge": return "jl";
            case "jge": return "jge";
            case "jnl": return "jge";
            case "jle": return "jle";
            case "jng": return "jle";
            case "call": return "call";
            case "callq": return "call";
            case "leave": return "leave";
            case "leaveq": return "leave";
            case "ret": return "ret";
            case "retq": return "ret";
            default: {return inst}
        }
    }

    correctRegCase = (reg) => {
        let lower = reg.toString().toLowerCase();
        switch(lower) {
            case "%rax": return "rax";
            case "%eax": return "rax";
            case "%ax": return "rax";
            case "%al": return "rax";
            case "%rbx": return "rbx";
            case "%ebx": return "rbx";
            case "%bx": return "rbx";
            case "%bl": return "rbx";
            case "%rcx": return "rcx";
            case "%ecx": return "rcx";
            case "%cx": return "rcx";
            case "%cl": return "rcx";
            case "%rdx": return "rdx";
            case "%edx": return "rdx";
            case "%dx": return "rdx";
            case "%dl": return "rdx";
            case "%rsi": return "rsi";
            case "%esi": return "rsi";
            case "%si": return "rsi";
            case "%sil": return "rsi";
            case "%rdi": return "rdi";
            case "%edi": return "rdi";
            case "%di": return "rdi";
            case "%dil": return "rdi";
            case "%rsp": return "rsp";
            case "%esp": return "rsp";
            case "%sp": return "rsp";
            case "%spl": return "rsp";
            case "%rbp": return "rbp";
            case "%ebp": return "rbp";
            case "%bp": return "rbp";
            case "%bpl": return "rbp";
            case "%rip": return "rip";
            case "%r8": return "r8";
            case "%r8d": return "r8";
            case "%r8w": return "r8";
            case "%r8b": return "r8";
            case "%r9": return "r9";
            case "%r9d": return "r9";
            case "%r9w": return "r9";
            case "%r9b": return "r9";
            case "%r10": return "r10";
            case "%r10d": return "r10";
            case "%r10w": return "r10";
            case "%r10b": return "r10";
            case "%r11": return "r11";
            case "%r11d": return "r11";
            case "%r11w": return "r11";
            case "%r11b": return "r11";
            case "%r12": return "r12";
            case "%r12d": return "r12";
            case "%r12w": return "r12";
            case "%r12b": return "r12";
            case "%r13": return "r13";
            case "%r13d": return "r13";
            case "%r13w": return "r13";
            case "%r13b": return "r13";
            case "%r14": return "r14";
            case "%r14d": return "r14";
            case "%r14w": return "r14";
            case "%r14b": return "r14";
            case "%r15": return "r15";
            case "%r15d": return "r15";
            case "%r15w": return "r15";
            case "%r15b": return "r15";
            default:{return reg;}
        }
    }

    getNumberByRegister = (reg) => {
        switch(reg) {
            case "rax": return 0;
            case "rbx": return 1;
            case "rcx": return 2;
            case "rdx": return 3;
            case "rsi": return 4;
            case "rdi": return 5;
            case "rsp": return 6;
            case "rbp": return 7;
            case "rip": return 8;
            case "r8": return 9;
            case "r9": return 10;
            case "r10": return 11;
            case "r11": return 12;
            case "r12": return 13;
            case "r13": return 14;
            case "r14": return 15;
            case "r15": return 16;
            default:{return -1;}
        }
    }

    getRegisterByNumber = (num) => {
        switch(num) {
            case 0: return "rax"; 
            case 1: return "rbx"; 
            case 2: return "rcx"; 
            case 3: return "rdx"; 
            case 4: return "rsi"; 
            case 5: return "rdi"; 
            case 6: return "rsp";
            case 7: return "rbp"; 
            case 8: return "rip"; 
            case 9: return "r8"; 
            case 10: return "r9";
            case 11: return "r10";
            case 12: return "r11"; 
            case 13: return "r12"; 
            case 14: return "r13"; 
            case 15: return "r14";
            case 16: return "r15"; 
            default: {}
        }
    }

    pop = (data) => {
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        let arg4 = "";
        let arg5 = "";
        let arg6 = "";
        // console.log(data);

        for(const elem of data) {
            if(typeof elem.arg1 === 'string' || data.arg1 instanceof String) {
                arg1 = elem.arg1;
                arg1 = arg1.replace("{", "");
                arg1 = arg1.replace("}", "");
            }
            if(typeof elem.arg2 === 'string' || data.arg1 instanceof String) {
                arg2 = elem.arg2;
                arg2 = arg2.replace("}", "");
            }
            if(typeof elem.arg3 === 'string' || data.arg1 instanceof String) {
                arg3 = elem.arg3;
                arg3 = arg3.replace("}", "");
            }
            if(typeof elem.arg4 === 'string' || data.arg1 instanceof String) {
                arg4 = elem.arg4;
                arg4 = arg4.replace("}", "");
            }
            if(typeof elem.arg5 === 'string' || data.arg1 instanceof String) {
                arg5 = elem.arg5;
                arg5 = arg5.replace("}", "");
            }
            if(typeof elem.arg6 === 'string' || data.arg1 instanceof String) {
                arg6 = elem.arg6;
                arg6 = arg6.replace("}", "");
            }
        }
        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        arg3 = this.correctRegCase(arg3);
        arg4 = this.correctRegCase(arg4);
        arg5 = this.correctRegCase(arg5);
        arg6 = this.correctRegCase(arg6);
        if(arg1.includes("-")) {
            let start = this.getNumberByRegister(this.correctRegCase(arg1.substring(0, arg1.indexOf("-"))));
            let end = this.getNumberByRegister(this.correctRegCase(arg1.substring(arg1.indexOf("-") + 1, arg1.length)));
            let count = 1
            for(let i = start; i <= end; i++) {
                switch(count) {
                    case 1: arg1 = this.getRegisterByNumber(i); break;
                    case 2: arg2 = this.getRegisterByNumber(i); break;
                    case 3: arg3 = this.getRegisterByNumber(i); break;
                    case 4: arg4 = this.getRegisterByNumber(i); break;
                    case 5: arg5 = this.getRegisterByNumber(i); break;
                    case 6: arg6 = this.getRegisterByNumber(i); break;
                    default:{}
                }
                count++;
            }
        }

        let popData = {arg1: arg1, arg2: arg2, arg3: arg3, arg4: arg4, arg5: arg5, arg6: arg6};
        
        this.props.pop(popData);
    }

    ldr = (data) => {
        // console.log("load");
        let arg1 = "";
        let offset = "";
        let arg2 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
        }    
        if((arg1.substring(0, 1) === "(") && (arg1.substring(arg1.length - 1, arg1.length) === ")")) {
          arg1 = arg1.substring(1, arg1.length-1);
          offset = null;
        } else {
          for(let i = 0; i < arg1.length; i++) {
            if(arg1.substring(i, i+1) === "(") {
              offset = arg1.substring(0, i);     
              offset = parseInt(offset);
              arg1 = arg1.substring(i+1, arg1.length-1);
            }
          }
        }
        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        let ldrData = {arg1: arg1, arg2: arg2, arg3: offset};
        this.props.ldr(ldrData);    
    }

    str = (data) => {
        let arg1 = "";
        let arg2 = "";
        let offset = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
        }    
        if((arg2.substring(0, 1) === "(") && (arg2.substring(arg2.length - 1, arg2.length) === ")")) {
            arg2 = arg2.substring(1, arg2.length-1);
            offset = null;
        } else {
            for(let i = 0; i < arg2.length; i++) {
              if(arg2.substring(i, i+1) === "(") {
                offset = arg2.substring(0, i);     
                offset = parseInt(offset);
                arg2 = arg2.substring(i+1, arg2.length-1);
              }
            }
        }
        if(arg1.substring(0, 1) === "$") {
          if (arg1.substring(1, 3) === "0x") {
            arg1 = this.hexToInt(arg1.substring(3, arg1.length));
          }
          else { 
            arg1 = parseInt(arg1.substring(1, arg1.length));
          }
        } else {
          arg1 = this.correctRegCase(arg1);
        }
        arg2 = this.correctRegCase(arg2);
        let strData = {arg1: arg1, arg2: arg2, arg3: offset};
        this.props.str(strData);        
    }

    bitwise = (data, func) => {
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                arg3 = elem.arg3;
            }
        }    
        if(arg1.substring(0, 1) === "$") {
            if (arg1.substring(1, 3) === "0x") {
              arg1 = this.hexToInt(arg1.substring(3, arg1.length));
            }
            else { 
              arg1 = parseInt(arg1.substring(1, arg1.length));
            }
        }
        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        arg3 = this.correctRegCase(arg3);
        let bitData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};
        this.props.bitwise(bitData, func);
    }

    render() {
        return (
            <div>
                <form noValidate autoComplete = "off" onChange = {this.handleChange}>
                    {this.state.visualize || this.state.step ? 
                    <h3>
                    <pre style={{fontSize: "1vw"}}>
                        <Highlight search={this.state.nextInstruction}>{this.state.debugCode}</Highlight>
                    </pre></h3>
                    :
                    <TextField InputProps={{
                        startAdornment: <InputAdornment style={{marginRight: "1vw"}} position="start"><pre style={{fontSize: "1vw"}}>{this.listedLinesCalc(this.state.numLines).map(line=>
                        <div>
                            {line === " 1  \n" ? <div>{"\n"}</div> : null}
                            {/* {this.state.breakpoints.includes(parseInt(line)) ? 
                                <Button onClick={() => this.addBreakpoint(line, false)} id={line} style={{height: "1vh"}}><FiberManualRecordIcon style={{fontSize: "1.5vh"}}></FiberManualRecordIcon></Button>:
                                <Button className="Hidden" onClick={() => this.addBreakpoint(line, true)} id={line} style={{height: "1vh"}}><FiberManualRecordOutlinedIcon style={{fontSize: "1.5vh"}}></FiberManualRecordOutlinedIcon></Button>} */}
                            {line}
                        </div>)} </pre></InputAdornment>, 

                        style: {fontSize: "1.1vw", boxShadow: "0 0 0 0", borderRadius: "0", padding: "0.5vw"}
                    }} value={this.state.code} margin="none" padding="0" fullWidth={true} id="code" variant="outlined" multiline rows={10} rowsMax={101}></TextField>}
                </form>

            <RunOptions handleContinue={this.handleContinue} handleRun={this.handleRun} visualize={this.state.visualize} startVisualize={this.startVisualize} handleReset={this.handleReset} handleVisualize={this.handleVisualize} speed={this.state.speed} changeSpeed={this.changeSpeed} handleStep={this.handleStep} startStep={this.startStep} step={this.state.step}/>
            {this.state.visualize || this.state.step ? null : <SampleCodex86 genCode={(code, num) => this.genCode(code, num)}/>}
        </div>
        )
    }
}

export default Parserx86;