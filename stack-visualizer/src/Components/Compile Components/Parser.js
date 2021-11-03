import React from 'react';
import TextField from "@material-ui/core/TextField";
import Highlight from 'react-highlighter';
import RunOptions from './RunOptions.js';
import SampleCode from './SampleCode.js';
import InputAdornment from '@material-ui/core/InputAdornment';
// import Button from '@material-ui/core/Button';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
// import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import './../../App.css';

class Parser extends React.Component {
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
        while(hex.length < 8) {
            hex = "0" + hex;
        }
        var num = parseInt(hex, 16);
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
        // console.log(branchData[0]);
        // console.log(instructionData.labels);

        // If the instruction is a branch, we must highlight where it will branch to
        let instruction = branchData[0].instruction;
        if(instruction === "B" || (instruction === "BNE" && this.state.status !== 0) || (instruction === "BEQ" && this.state.status === 0) || (instruction === "BGT" && this.state.status === 1) || (instruction === "BLT" && this.state.status === -1) || (instruction === "BGE" && this.state.status !== -1) || (instruction === "BLE" && this.state.status !== 1) || instruction === "BL" || instruction === "BX") {
            branch = true;
            let line;
            if(instruction === "BX") {
                line = this.bx(branchData[0].arg1) - 1;
            }
            else {
                line = this.branch(branchData, instructionData.labels);
            }
            // console.log(line);
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
            case "R0": {return(this.props.register.R0);}
            case "R1": {return(this.props.register.R1);}
            case "R2": {return(this.props.register.R2);}
            case "R3": {return(this.props.register.R3);}
            case "R4": {return(this.props.register.R4);}
            case "R5": {return(this.props.register.R5);}
            case "R6": {return(this.props.register.R6);}
            case "R7": {return(this.props.register.R7);}
            case "R8": {return(this.props.register.R8);}
            case "R9": {return(this.props.register.R9);}
            case "R10": {return(this.props.register.R10);}
            case "fp": {return(this.props.register.fp);}
            case "R12": {return(this.props.register.R12);}
            case "sp": {return(this.props.register.sp);}
            case "lr": {return(this.props.register.lr);}
            case "pc": {return(this.props.register.pc);}
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

        // console.log(labels);
        // console.log(instructions);

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
            // console.log("line: " + curLine);
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
            // console.log(elem);

            if((elem.line !== line) || (i === instructions.length - 1)) {
                if(i === instructions.length - 1) {
                    i++;
                    // console.log("Incrementing i");
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
                    case "ADD": {
                        let error = this.add(instructions.slice(begin, i));
                        if(!error) {
                            this.handleReset();
                            return;
                        }
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "SUB": {
                        let error = this.sub(instructions.slice(begin, i));
                        if(!error) {
                            this.handleReset();
                            return;
                        }
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "MUL": {
                        let error = this.mul(instructions.slice(begin, i));
                        if(!error) {
                            this.handleReset();
                            return;
                        }
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "MOV": {
                        let error = this.mov(instructions.slice(begin, i));
                        if(!error) {
                            this.handleReset();
                            return;
                        }
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "LDR": {
                        this.ldr(instructions.slice(begin, i));
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "STR": {
                        this.str(instructions.slice(begin, i));
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "B": {
                        // console.log("Branch");
                        line = this.branch(instructions.slice(begin, i), labels);
                        if(!step) {
                            i = instructionLines[line];
                        }
                        begin = i;
                        this.props.setPc(line+3);
                        // console.log(line);
                        // console.log(i);
                        break;
                    }
                    case "CMP": {
                        this.props.setPc(line+3);
                        status = this.cmp(instructions.slice(begin, i));
                        this.setState({
                            status: status
                        })
                        // console.log("Status: " + status);
                        begin = i;
                        line++;
                        break;
                    }
                    case "BGT": {
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
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BLT": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(status === -1) {
                            line = this.branch(instructions.slice(begin, i), labels);
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BEQ": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(status === 0) {
                            line = this.branch(instructions.slice(begin, i), labels);                      
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BNE": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(!(status === 0)) {
                            line = this.branch(instructions.slice(begin, i), labels);                   
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BGE": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(!(status === -1)) {
                            line = this.branch(instructions.slice(begin, i), labels);                     
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BLE": {
                        if(step) {
                            status = this.state.status;
                        }
                        if(!(status === 1)) {
                            line = this.branch(instructions.slice(begin, i), labels);                   
                            if(!step) {
                                i = instructionLines[line];
                            }
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BL": {
                        this.bl(line+2);
                        line = this.branch(instructions.slice(begin, i), labels);  
                        this.props.setPc(line+3);
                        if(!step) {
                            i = instructionLines[line];
                        }
                        begin = i;
                        break;
                    }
                    case "BX": {
                        line = this.bx(instructions.slice(begin, i)[1].arg1) - 1;
                        this.props.setPc(line+3);
                        if(!step) {
                            i = instructionLines[line];
                        }
                        begin = i;
                        break;
                    }
                    case "push": {
                        this.push(instructions.slice(begin, i));
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "pop": {
                        this.pop(instructions.slice(begin, i));
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "AND": {
                        this.bitwise(instructions.slice(begin, i), "AND");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "ORR": {
                        this.bitwise(instructions.slice(begin, i), "ORR");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "EOR": {
                        this.bitwise(instructions.slice(begin, i), "EOR");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "ASR": {
                        this.bitwise(instructions.slice(begin, i), "ASR");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "LSR": {
                        this.bitwise(instructions.slice(begin, i), "LSR");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "LSL": {
                        this.bitwise(instructions.slice(begin, i), "LSL");
                        this.props.setPc(line+3);
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
                // console.log("SETTING TYPE TO NULL");
                type = "";
            }
            if(elem.instruction !== null) {
                // console.log("SETTING TYPE TO: " + elem.instruction);
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
        if(arg2.substring(0, 1) === "#") {
            if (arg2.substring(1, 3) === "0x") {
                arg2 = this.hexToInt(arg2.substring(3, arg2.length));
            }
            else { 
                arg2 = parseInt(arg2.substring(1, arg2.length));
            }
        }

        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        let validNum = this.checkNumber(arg2);
        if(!validNum) {
            return false;
        }

        let movData = {arg1: arg1, arg2: arg2, handleSp: false};

        if(arg1 === "sp") {
            movData = {arg1: arg1, arg2: arg2, handleSp: true};
        }
        // console.log(movData);
        this.props.mov(movData);
        return true;
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
        if(arg3.substring(0, 1) === "#") {
            if (arg3.substring(1, 3) === "0x") {
                arg3 = this.hexToInt(arg3.substring(3, arg3.length));
            }
            else { 
                arg3 = parseInt(arg3.substring(1, arg3.length));
            }
        }

        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        arg3 = this.correctRegCase(arg3);
        let validNum1 = this.checkNumber(arg2);
        let validNum2 = this.checkNumber(arg3);
        if(!validNum1 || !validNum2) {
            return false;
        }

        let addData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg1 === "sp") {
            addData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: true};
        }
        // console.log("ADD: " + "arg1: " + arg1 + " arg2 : " + arg2 + " arg3: " + arg3);
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
        if(arg3.substring(0, 1) === "#") {
            if (arg3.substring(1, 3) === "0x") {
                arg3 = this.hexToInt(arg3.substring(3, arg3.length));
            }
            else { 
                arg3 = parseInt(arg3.substring(1, arg3.length));
            }
        }
        // console.log(arg3);

        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        arg3 = this.correctRegCase(arg3);
        let validNum1 = this.checkNumber(arg2);
        let validNum2 = this.checkNumber(arg3);
        if(!validNum1 || !validNum2) {
            return false;
        }

        let subData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg1 === "sp") {
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
        if(arg3.substring(0, 1) === "#") {
            if (arg3.substring(1, 3) === "0x") {
                arg3 = this.hexToInt(arg3.substring(3, arg3.length));
            }
            else { 
                arg3 = parseInt(arg3.substring(1, arg3.length));
            }
        }

        arg1 = this.correctRegCase(arg1);
        arg2 = this.correctRegCase(arg2);
        arg3 = this.correctRegCase(arg3);
        let validNum1 = this.checkNumber(arg2);
        let validNum2 = this.checkNumber(arg3);
        if(!validNum1 || !validNum2) {
            return false;
        }

        let multData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg1 === "sp") {
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
        if(arg2.substring(0, 1) === "#") {
            if (arg2.substring(1, 3) === "0x") {
                arg2 = this.hexToInt(arg2.substring(3, arg2.length));
            }
            else { 
                arg2 = parseInt(arg2.substring(1, arg2.length));
            }
        }
        else {
            arg2 = this.getRegister(this.correctRegCase(arg2));
        }

        arg1 = this.getRegister(this.correctRegCase(arg1));

        // console.log("CMP: arg1: " + arg1 + " arg2: " + arg2);
        
        let newStatus = 0;
        if(arg1 > arg2) {
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
        // console.log(name);
        // console.log(labels);

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
        else if(num > 2147483647 || num < -2147483648) {
            alert("Number exceeds 32 bits");
            return false;
        }
        else {
            return true;
        }
    }

    correctInstCase = (inst) => {
        let upper = inst.toString().toUpperCase();
        switch(upper) {
            case "AND": return "AND";
            case "ORR": return "ORR";
            case "EOR": return "EOR";
            case "ASR": return "ASR";
            case "LSR": return "LSR";
            case "LSL": return "LSL";
            case "MOV": return "MOV";
            case "ADD": return "ADD";
            case "SUB": return "SUB";
            case "MUL": return "MUL";
            case "PUSH": return "push";
            case "POP": return "pop";
            case "LDR": return "LDR";
            case "STR": return "STR";
            case "CMP": return "CMP";
            case "B": return "B";
            case "BEQ": return "BEQ";
            case "BNE": return "BNE";
            case "BGT": return "BGT";
            case "BLT": return "BLT";
            case "BGE": return "BGE";
            case "BLE": return "BLE";
            case "BL": return "BL";
            default: {return inst}
        }
    }

    correctRegCase = (reg) => {
        let lower = reg.toString().toLowerCase();
        switch(lower) {
            case "r0": return "R0";
            case "r1": return "R1";
            case "r2": return "R2";
            case "r3": return "R3";
            case "r4": return "R4";
            case "r5": return "R5";
            case "r6": return "R6";
            case "r7": return "R7";
            case "r8": return "R8";
            case "r9": return "R9";
            case "r10": return "R10";
            case "fp": return "fp";
            case "r12": return "R12";
            case "sp": return "sp";
            case "lr": return "lr";
            case "pc": return "pc";
            default:{return reg;}
        }
    }

    getNumberByRegister = (reg) => {
        switch(reg) {
            case "R0": return 0;
            case "R1": return 1;
            case "R2": return 2;
            case "R3": return 3;
            case "R4": return 4;
            case "R5": return 5;
            case "R6": return 6;
            case "R7": return 7;
            case "R8": return 8;
            case "R9": return 9;
            case "R10": return 10;
            case "fp": return 11;
            case "R12": return 12;
            case "sp": return 13;
            case "lr": return 14;
            case "pc": return 15;
            default:{return -1;}
        }
    }

    getRegisterByNumber = (num) => {
        switch(num) {
            case 0: return "R0"; 
            case 1: return "R1"; 
            case 2: return "R2"; 
            case 3: return "R3"; 
            case 4: return "R4"; 
            case 5: return "R5"; 
            case 6: return "R6";
            case 7: return "R7"; 
            case 8: return "R8"; 
            case 9: return "R9"; 
            case 10: return "R10";
            case 11: return "fp";
            case 12: return "R12"; 
            case 13: return "sp"; 
            case 14: return "lr"; 
            case 15: return "pc"; 
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
        let arg2 = "";
        let offset = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                offset = elem.arg3;
            }
        }    
        if(arg2.substring(0, 1) === "[") {
            arg2 = arg2.substring(1, arg2.length);
        }
        if(arg2.substring(arg2.length - 1, arg2.length) === "]") {
            arg2 = arg2.substring(0, arg2.length - 1);
        }
        if(offset.substring(offset.length - 1, offset.length) === "]") {
            offset = offset.substring(0, offset.length - 1);
        }
        if(offset.substring(0, 1) === "#") {
            if (offset.substring(1, 3) === "0x") {
                offset = this.hexToInt(offset.substring(3, offset.length));
            }
            else { 
                offset = parseInt(offset.substring(1, offset.length));
            }
        }
        if(arg2.substring(0, 1) === "#") {
            if (arg2.substring(1, 3) === "0x") {
                arg2 = this.hexToInt(arg2.substring(3, arg2.length));
            }
            else { 
                arg2 = parseInt(arg2.substring(1, arg2.length));
            }
        }
        if(offset === "") {
            offset = null;
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
            if(elem.arg3 !== null) {
                offset = elem.arg3;
            }
        }    
        if(arg2.substring(0, 1) === "[") {
            arg2 = arg2.substring(1, arg2.length);
        }
        if(arg2.substring(arg2.length - 1, arg2.length) === "]") {
            arg2 = arg2.substring(0, arg2.length - 1);
        }
        if(offset.substring(offset.length - 1, offset.length) === "]") {
            offset = offset.substring(0, offset.length - 1);
        }
        if(offset.substring(0, 1) === "#") {
            if (offset.substring(1, 3) === "0x") {
                offset = this.hexToInt(offset.substring(3, offset.length));
            }
            else { 
                offset = parseInt(offset.substring(1, offset.length));
            }
        }
        if(arg2.substring(0, 1) === "#") {
            if (arg2.substring(1, 3) === "0x") {
                arg2 = this.hexToInt(arg2.substring(3, arg2.length));
            }
            else { 
                arg2 = parseInt(arg2.substring(1, arg2.length));
            }
        }
        if(offset === "") {
            offset = null;
        }
        arg1 = this.correctRegCase(arg1);
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
        if(arg3.substring(0, 1) === "#") {
            if (arg3.substring(1, 3) === "0x") {
                arg3 = this.hexToInt(arg3.substring(3, arg3.length));
            }
            else { 
                arg3 = parseInt(arg3.substring(1, arg3.length));
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
            {this.state.visualize || this.state.step ? null : <SampleCode genCode={(code, num) => this.genCode(code, num)}/>}
        </div>
        )
    }
}

export default Parser;