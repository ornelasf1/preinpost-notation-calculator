import React from 'react';
import { setInfixToPostfixSeq } from './ConversionAlgoActions';



export class NotationCalc{
    
}

const divInstrWrapper = comp => {
    return (<div className='instruction'>{comp}</div>);
}

const toTokens = input => {
    if(typeof input !== 'string') return '';
    let tokens = input.trim();
    tokens = tokens.split(/(\s+)/);
    tokens = tokens.filter(s => s.trim().length > 0);
    return tokens;
};

const prec = operator => {
    switch(operator){
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        case '^':
            return 3;
        case '(':
        case ')':
            return 4;
        default:
            return 0;
        
    }
};

export const infixToPostfixInstructions = [
    'Is the list of tokens empty?',
    '\tConsider token from the set of tokens',
    '\tIf the token is an operator:',
    '\t\tIf the operator stack is empty or the top of the operator stack is a \'(\'',
    '\t\t\tPush the selected token to the operator stack',
    '\t\tIf the selected token is a \'(\'',
    '\t\t\tPush the selected token to the operator stack',
    '\t\tIf the selected token is \')\'',
    '\t\t\tWhile the top of the operator stack is not a \'(\'',
    '\t\t\t\tPop the token from the top of the operator stack and output it',
    '\t\t\tRemove the \'(\' from the top of the operator stack',
    '\t\tIf the selected token has a higher precedence than the token on the top of the operator stack',
    '\t\t\tPush the selected token to the operator stack',
    '\t\tIf the selected token has a lower or equal precedence than the token on the top of the operator stack',
    '\t\t\tPop the token from the top of the operator stack and output it',
    '\t\t\tWhile the operator stack is not empty and the selected token has a lower or equal precedence than the token on the top of the operator stack',
    '\t\t\t\tPop the token from the top of the operator stack and output it',
    '\t\t\tPush the selected token to the operator stack',
    '\tIf the token is an operand:',
    '\t\tOutput the selected token',
    'Output all remaining tokens from the operator stack'
];

export const infixToPostfix = infix => {
    let seq = [];
    let infixTokens = toTokens(infix).reverse();

    const stack = [];
    let postfixExpr = '';

    console.log('Tokens: ', infixTokens);

    seq.push(0);
    while (infixTokens.length > 0) {
        const token = infixTokens.pop();
        seq.push(1);
        seq.push(2);
        if (prec(token) > 0) {
            let topToken = stack.length !== 0? stack[stack.length - 1] : '';
            
            if (stack.length === 0 || topToken === '(') {
                seq.push(3);
                seq.push(4);
                stack.push(token);
            } else if (token === '(') {
                seq.push(5);
                seq.push(6);
                stack.push(token);
            } else if (token === ')') {
                seq.push(7);
                while (topToken !== '(') {
                    seq.push(8);
                    seq.push(9);
                    postfixExpr += stack.pop();
                    topToken = stack.length !== 0? stack[stack.length - 1] : '';
                    if (stack.length === 0) return '';
                }
                seq.push(10);
                stack.pop();
            } else if (prec(token) > prec(topToken)) {
                seq.push(11);
                seq.push(12);
                stack.push(token);
            } else if (prec(token) <= prec(topToken)) {
                seq.push(13);
                seq.push(14);
                postfixExpr += stack.pop();
                topToken = stack.length !== 0? stack[stack.length - 1] : '';
                while (stack.length > 0 && prec(token) <= prec(topToken)) {
                    seq.push(15);
                    seq.push(16);
                    postfixExpr += stack.pop();
                }
                seq.push(17);
                stack.push(token);
            }
        } else {
            seq.push(18);
            seq.push(19);
            postfixExpr += token;
        }

        seq.push(20);
        if(infixTokens.length === 0){
            while(stack.length > 0) {
                postfixExpr += stack.pop();
            }
        }

    }
    setInfixToPostfixSeq(seq);
    
    return postfixExpr.split('').join(' ');
};
