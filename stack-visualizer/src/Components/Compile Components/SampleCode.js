import React from 'react';
import Button from '@material-ui/core/Button';


class SampleCode extends React.Component {
    constructor() {
        super()
        this.state = {
            sampleCodeNum: 0
        }
    }

    genCode = () => {
        let fact = 'factorial: \n' +
        'MOV R0, #5 \n' +
        'BL fact \n' +
        'B finish \n' +
        'fact: push {R4, fp, lr} \n' +
        'CMP R0, #1 \n' +
        'BLE ret_one \n' +
        'MOV R4, R0 \n' +
        'SUB R0, R0, #1 \n' +
        'BL fact \n' +
        'MUL R0, R0, R4 \n' +
        'B end \n' +
        'ret_one: MOV R0, #1 \n' +
        'end: pop {R4, fp, lr} \n' +
        'BX lr \n' +
        'MOV R0, #3 \n' +
        'BL fact \n' +
        'MOV R2, R0	\n' +				
        'finish:';
        let sum = 'sumNums: \n' +
        'MOV R0, #5 \n' +
        'MOV R1 #0 \n' +
        'MOV R2, #0 \n' +
        'MOV R3, R0 \n' +
        'pushLoop: push {fp} \n' +
        'SUB sp, sp, #8 \n' +
        'ADD fp, sp, #8 \n' +
        'STR R0, [fp, #-4] \n' +
        'SUB R0, R0, #1 \n' +
        'CMP R0, #0 \n' +
        'BGT pushLoop \n' +
        'MOV R0, R3 \n' +
        'popLoop: LDR R1, [fp, #-4] \n' +
        'ADD R2, R2, R1 \n' +
        'SUB sp, fp, #0 \n' +
        'pop {fp} \n' +
        'SUB R0, R0, #1 \n' +
        'CMP R0, #0 \n' +
        'BGT popLoop \n' +
        'MOV R0, R2'
        let fib = 'fibonacci: \n' +
        'push {R1-R3} \n' +
        'MOV R0, #7 \n' +
        'MOV R1, #0 \n' +
        'MOV R2, #1 \n' +
        'fibloop: \n' +
        'MOV R3, R2 \n' +
        'ADD R2, R1, R2 \n' +
        'MOV R1, R3 \n' +
        'SUB R0, R0, #1 \n' +
        'CMP R0, #1 \n' +
        'BNE fibloop \n' +
        'MOV R0, R2 \n' +
        'pop {R1-R3}'

        let num = Math.floor(Math.random() * 3 + 1);
        while(num === this.state.sampleCodeNum) {
            num = Math.floor(Math.random() * 3 + 1);
        }
        if (num === 1) {
            this.props.genCode(fact);
        }
        else if (num === 2) {
            this.props.genCode(sum);
        }
        else {
            this.props.genCode(fib);
        }
        this.setState({
            sampleCodeNum: num
        })
        
    }

    render() {
        return (
            <div className="GenCode">
                <Button style = {{fontSize: "0.7vw", boxShadow: "0 0 0 0", borderRadius: "0.5vw", minWidth: "13vw", minHeight: "2vw", width: "13vw", height: "2vw"}} color="primary" variant="contained" onClick={this.genCode}>Generate Sample Code</Button>
            </div>
        );
    }
}

export default SampleCode;