import React from 'react';
import Grid from '@material-ui/core/Grid';
import './../App.css';
// import Instructions from './../Images/SupportedInstructions.png';
import StepTool from './../Images/StepTool.png';
import FunctionTool from './../Images/FunctionTool.png';
import Links from './Links.js';

class ArmInfo extends React.Component {
  render() {
    return (
        <Grid container className = "ArmInfo">
          
          <Grid item style={{width: "75vw", marginLeft: "12.5vw", marginTop: "1vh"}}>

            <Grid container className="SupportedInstructionsHeader">
              <Grid item>
                <h3>Supported Instructions</h3>
              </Grid>
            </Grid>

            <Grid container className="SupportedInstructionsSubHeader">
              <Grid item>
                <h4>ARM</h4>
              </Grid>
            </Grid>

            <Grid container className="SupportedInstructionsBody"> 
              <Grid item style={{paddingLeft: "1vw", paddingRight: "1vw"}}>
                <pre style={{fontFamily: "'Times New Roman', Times, serif"}}>
                  {"AND <Register>, <Register>, <Register/Immediate>\n" +
                  "ORR <Register>, <Register>, <Register/Immediate>\n" + 
                  "EOR <Register>, <Register>, <Register/Immediate>\n" + 
                  "ASR <Register>, <Register>, <Register/Immediate>\n" + 
                  "LSR <Register>, <Register>, <Register/Immediate>\n" + 
                  "LSL <Register>, <Register>, <Register/Immediate>\n" + 
                  "MOV <Register>, <Register/Immediate>\n" + 
                  "ADD <Register>, <Register>, <Register/Immediate>\n" + 
                  "SUB <Register>, <Register>, <Register/Immediate>\n" + 
                  "MUL <Register>, <Register>, <Register/Immediate>\n" + 
                  "push {<Register>, <Register>}  (from 1-6 registers) \n" + 
                  "pop {<Register>, <Register>}  (from 1-6 registers) \n" + 
                  "LDR <Register>, [<Register>, <ImmediateOffset>] OR LDR <Register>, [<Address>]\n" + 
                  "STR <Register>, [<Register>, <ImmediateOffset>] OR STR <Register>, [<Address>]\n" + 
                  "CMP <Register>, <Register/Immediate>\n" + 
                  "B <LabelName>\n" +
                  "BEQ <LabelName>\n" + 
                  "BNE <LabelName>\n" + 
                  "BGT <LabelName>\n" + 
                  "BLT <LabelName>\n" + 
                  "BGE <LabelName>\n" + 
                  "BLE <LabelName>\n" + 
                  "BL <LabelName>\n" + 
                  "To add a label use '<LabelName>: <Instruction>'\n" + 
                  "Immediates should begin with ‘#’ e.g. #15 or #0xF"}
                </pre>
              </Grid>
            </Grid>

            <Grid container className="SupportedInstructionsSubHeader">
              <Grid item>
                <h4>X86-64</h4>
              </Grid>
            </Grid>

            <Grid container className="SupportedInstructionsEndBody"> 
              <Grid item style={{paddingLeft: "1vw", paddingRight: "1vw"}}>
                <pre style={{fontFamily: "'Times New Roman', Times, serif"}}>
                  {"and <Register/Immediate>, <Register>\n" +
                  "or <Register/Immediate>, <Register>\n" + 
                  "xor <Register/Immediate>, <Register>\n" + 
                  "sar <Register/Immediate>, <Register>\n" + 
                  "shr <Register/Immediate>, <Register>\n" + 
                  "sal <Register/Immediate>, <Register>\n" + 
                  "mov <Register/Immediate>, <Register>\n" + 
                  "mov <Offset>(<Register>), <Register>\n" +
                  "mov <Register>, <Offset>(<Register>)\n" +
                  "add <Register/Immediate>, <Register>\n" + 
                  "sub <Register/Immediate>, <Register>\n" + 
                  "imul <Register/Immediate>, <Register>\n" + 
                  "push <Register/Immediate>\n" + 
                  "pop <Register>\n" + 
                  "cmp <Register/Immediate>, <Register>\n" + 
                  "jmp <LabelName>\n" +
                  "je <LabelName>\n" + 
                  "jne <LabelName>\n" + 
                  "jg <LabelName>\n" + 
                  "jnle <LabelName>\n" + 
                  "jl <LabelName>\n" + 
                  "jnge <LabelName>\n" + 
                  "jge <LabelName>\n" + 
                  "jnl <LabelName>\n" +
                  "jle <LabelName>\n" +
                  "jng <LabelName>\n" +
                  "call <LabelName>\n" +
                  "leave" +
                  "ret" +
                  "To add a label use '<LabelName>: <Instruction>'\n" + 
                  "Immediates should begin with ‘$’ e.g. $15 or $0xF" + 
                  "Registers should begin with ‘%’ e.g. %rax or %esi"}
                </pre>
              </Grid>
            </Grid>

          </Grid>


          <Grid item style={{width: "75vw", marginTop: "8vh", marginBottom: "8vh", marginLeft: "12.5vw"}}>

            <Grid container className="AboutTextHeader">
              <Grid item>
                <h3>Visualize Tool</h3>
              </Grid>
            </Grid>

            <img style={{height: "34vw", width: "75vw"}} src={FunctionTool} alt="Logo" />

            <Grid container className="AboutTextBody">
              <Grid item style={{paddingLeft: "1vw", paddingRight: "1vw"}}>
                <h3>To understand how functions are pushed onto the stack, click the Push Function button.  Select saved registers and parameters.  Parameters are listed with the argument number.  By convention, arguments 1-4 are stored in registers R0-R3, with additional parameters pushed onto the stack.  Local variables and parameters are also listed by their relative position to the frame pointer.  The frame pointer (fp) and the stack pointer (sp) bind the current stack frame which is highlighted gold.  The Pop button increases the stack pointer by 4 and stores the value in register addresses back into the register file.  Currently not available for x86-64</h3>
              </Grid>
            </Grid>

          </Grid>
          

          <Grid item style={{width: "75vw", marginLeft: "12.5vw", marginBottom: "10vh"}}>

            <Grid container className="AboutTextHeader">
              <Grid item>
                <h3>Text Editor</h3>
              </Grid>
            </Grid>

            <img style={{height: "32vw", width: "75vw"}} src={StepTool} alt="Logo" />

            <Grid container className="AboutTextBody">
              <Grid item style={{paddingLeft: "1vw", paddingRight: "1vw"}}>
                <h3>The Text Editor accepts code that can be run.  Click generate sample code to generate a sample program.  Running the code will only display the state of the stack and register file after the program finishes.  To view the development of the stack, step through the code using the Step tab, or use the the Visualize tab to step though at a constant rate.  Clicking the Clear button will clear the contents of the stack at any time.</h3>
              </Grid>
            </Grid>

          </Grid>

          <Grid container className="AboutLinks">
            <Grid item>
              <Links/>
            </Grid>
          </Grid>


        </Grid>
    );
  }
}

export default ArmInfo;