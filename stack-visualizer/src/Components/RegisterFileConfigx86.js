import React from 'react';
import Grid from '@material-ui/core/Grid';
import './../App.css';

class RegisterFileConfigx86 extends React.Component {
    decimalToHex = (number) => {
        if (number < 0) {
            number = 0xFFFFFFFFFFFFFFFF + number + 1;
        }
        let hexNum = number.toString(16).toUpperCase();
        while(hexNum.length < 8) { // should be 16 but there is a sizing issue on the screen displaying all 64 bits
            hexNum = 0 + hexNum;
        }

        return "0x" + hexNum;
    }

    // decimalToHex = (decimalNumber) => {
    //     let hexNum = [];
    
    //     while(decimalNumber!==0) {
    //         let temp  = 0; 
    //         temp = decimalNumber % 16; 
           
    //         if(temp < 10) {
    //             hexNum.push(String.fromCharCode(temp + 48)); 
    //         } 
    //         else {
    //             hexNum.push(String.fromCharCode(temp + 55)); 
    //         } 
    //         decimalNumber = decimalNumber/16; 
    //     } 

    //     if(decimalNumber === 0) {
    //         for(let i = 0; i < 8; i++) {
    //             hexNum.push(0);
    //         }
    //     }

    //     let reverse = []
    //     let j = 2;
    //     for(let i = 7; i >= 0; i--) {
    //         reverse[j] = hexNum[i];
    //         j++;
    //     }
    //     reverse[0] = '0';
    //     reverse[1] = 'x';
    //     return(reverse);
    // }

    render() {
        return (
            <Grid container className="Row">
                <Grid item style={this.props.decimal ? {paddingRight: "3vw"} : {paddingRight: "1.5vw"}}>
                    <Grid container className="Column">
                        <Grid item className="RegFileFont">
                            <h2>rax: {this.props.decimal ? this.props.register.rax: this.decimalToHex(this.props.register.rax)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>rbx: {this.props.decimal ? this.props.register.rbx: this.decimalToHex(this.props.register.rbx)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>rcx: {this.props.decimal ? this.props.register.rcx: this.decimalToHex(this.props.register.rcx)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>rdx: {this.props.decimal ? this.props.register.rdx: this.decimalToHex(this.props.register.rdx)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>rsi: {this.props.decimal ? this.props.register.rsi: this.decimalToHex(this.props.register.rsi)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>rdi: {this.props.decimal ? this.props.register.rdi: this.decimalToHex(this.props.register.rdi)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>rbp: {this.props.decimal ? this.props.register.rbp: this.decimalToHex(this.props.register.rbp)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>rsp: {this.props.decimal ? this.props.register.rsp: this.decimalToHex(this.props.register.rsp)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>rip: {this.props.decimal ? this.props.register.rip: this.decimalToHex(this.props.register.rip)}</h2> 
                        </Grid>
                    </Grid>
                </Grid>
                
                <Grid item>
                    <Grid container className="Column">
                        <Grid item className="RegFileFont">
                            <h2>r8: {this.props.decimal ? this.props.register.r8: this.decimalToHex(this.props.register.r8)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>r9: {this.props.decimal ? this.props.register.r9: this.decimalToHex(this.props.register.r9)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>r10: {this.props.decimal ? this.props.register.r10: this.decimalToHex(this.props.register.r10)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>r11: {this.props.decimal ? this.props.register.r11: this.decimalToHex(this.props.register.r11)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>r12: {this.props.decimal ? this.props.register.r12: this.decimalToHex(this.props.register.r12)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>r13: {this.props.decimal ? this.props.register.r13: this.decimalToHex(this.props.register.r13)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>r14: {this.props.decimal ? this.props.register.r14: this.decimalToHex(this.props.register.r14)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>r15: {this.props.decimal ? this.props.register.r15: this.decimalToHex(this.props.register.r15)}</h2> 
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        )
    }
}

export default RegisterFileConfigx86;