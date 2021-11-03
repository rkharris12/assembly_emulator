import React from 'react';
import Grid from '@material-ui/core/Grid';
import './../App.css';

class RegisterFileConfig extends React.Component {
    decimalToHex = (number) => {
        if (number < 0) {
            number = 0xFFFFFFFF + number + 1;
        }
        let hexNum = number.toString(16).toUpperCase();
        while(hexNum.length < 8) {
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
                            <h2>R0: {this.props.decimal ? this.props.register.R0: this.decimalToHex(this.props.register.R0)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R1: {this.props.decimal ? this.props.register.R1: this.decimalToHex(this.props.register.R1)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R2: {this.props.decimal ? this.props.register.R2: this.decimalToHex(this.props.register.R2)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R3: {this.props.decimal ? this.props.register.R3: this.decimalToHex(this.props.register.R3)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R4: {this.props.decimal ? this.props.register.R4: this.decimalToHex(this.props.register.R4)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R5: {this.props.decimal ? this.props.register.R5: this.decimalToHex(this.props.register.R5)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R6: {this.props.decimal ? this.props.register.R6: this.decimalToHex(this.props.register.R6)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R7: {this.props.decimal ? this.props.register.R7: this.decimalToHex(this.props.register.R7)}</h2> 
                        </Grid>
                    </Grid>
                </Grid>
                
                <Grid item>
                    <Grid container className="Column">
                        <Grid item className="RegFileFont">
                            <h2>R8: {this.props.decimal ? this.props.register.R8: this.decimalToHex(this.props.register.R8)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R9: {this.props.decimal ? this.props.register.R9: this.decimalToHex(this.props.register.R9)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R10: {this.props.decimal ? this.props.register.R10: this.decimalToHex(this.props.register.R10)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>fp: {this.props.decimal ? this.props.register.fp: this.decimalToHex(this.props.register.fp)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>R12: {this.props.decimal ? this.props.register.R12: this.decimalToHex(this.props.register.R12)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>sp: {this.props.decimal ? this.props.register.sp: this.decimalToHex(this.props.register.sp)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>lr: {this.props.decimal ? this.props.register.lr: this.decimalToHex(this.props.register.lr)}</h2> 
                        </Grid><Grid item className="RegFileFont">
                            <h2>pc: {this.props.decimal ? this.props.register.pc: this.decimalToHex(this.props.register.pc)}</h2> 
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        )
    }
}

export default RegisterFileConfig;