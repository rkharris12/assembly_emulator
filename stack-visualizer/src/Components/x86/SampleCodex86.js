import React from 'react';
import Button from '@material-ui/core/Button';


class SampleCodex86 extends React.Component {
    constructor() {
        super()
        this.state = {
            sampleCodeNum: 0
        }
    }

    genCode = () => {
        let fact = 'factorial: \n' +
        'pushq $5 \n' +
        'call fact \n' +
        'jmp finish \n' +
        'fact: \n' +
        'pushq %rbp \n' +
        'movq %rsp, %rbp \n' +
        'movq 16(%rbp), %rbx \n' +
        'cmpq $1, %rbx \n' +
        'jle ret_one \n' +
        'subq $1, %rbx \n' +
        'pushq %rbx \n' +
        'call fact \n' +
        'addq $8, %rsp \n' +
        'movq 16(%rbp), %rbx \n' +
        'imulq %rbx, %rax \n' +
        'jmp end \n' +
        'ret_one: \n' +
        'movq $1, %rax \n' +
        'end: \n' +
        'leave \n' +
        'ret \n' +
        'finish: \n' +
        'addq $8, %rsp'
        let sum = 'sumNums: \n' +
        'movq $5, %rax \n' +
        'movq $0, %rbx\n' +
        'movq $0, %rcx \n' +
        'movq %rax, %rdx \n' +
        'pushLoop: pushq %rbp \n' +
        'movq %rsp, %rbp \n' +
        'subq $16, %rsp \n' +
        'movq %rax, -8(%rbp) \n' +
        'subq $1, %rax \n' +
        'cmpq $0, %rax \n' +
        'jg pushLoop \n' +
        'movq %rdx, %rax \n' +
        'popLoop: movq -8(%rbp), %rbx \n' +
        'addq %rbx, %rcx \n' +
        'movq %rbp, %rsp \n' +
        'popq %rbp \n' +
        'subq $1, %rax \n' +
        'cmpq $0, %rax \n' +
        'jg popLoop \n' +
        'movq %rcx, %rax'
        let fib = 'fibonacci: \n' +
        'movl $7, %eax \n' +
        'pushq %rbx \n' +
        'pushq %rcx \n' +
        'pushq %rdx \n' +
        'movl $0, %ebx \n' +
        'movl $1, %ecx \n' +
        'fibLoop: \n' +
        'movl %ecx, %edx \n' +
        'addl %ebx, %ecx \n' +
        'movl %edx, %ebx \n' +
        'subl $1, %eax \n' +
        'cmpl $1, %eax \n' +
        'jne fibLoop \n' +
        'movl %ecx, %eax \n' +
        'popq %rdx \n' +
        'popq %rcx \n' +
        'popq %rbx'

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

export default SampleCodex86;