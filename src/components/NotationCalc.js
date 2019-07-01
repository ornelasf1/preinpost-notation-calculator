import React from 'react';
import {connect} from 'react-redux';
import { setInfixToPostfixSeq } from './ConversionAlgoActions';
import { infixToPostfixInstructions } from './NotationCalcInstructions';



export class NotationCalc{
    
}

export const InfixAlgorithm = props => {

    return (
        <div></div>
    );
};



const toTokens = input => {
    if(typeof input !== 'string') return '';
    let tokens = input.trim();

    tokens = tokens.split('').reduce((acc, curr) => {
        if (acc.length === 0) {
            acc.push(curr);
        } else {
            const top = acc[acc.length - 1];
            if (prec(top) === prec(curr)){
                acc[acc.length - 1] = top + curr;
            } else {
                acc.push(curr);
            }
        }
        return acc;
    }, []);

    tokens = tokens.map(s => s.trim()).filter(s => s.trim().length > 0);

    // tokens = tokens.split(/(\s+)/);
    // tokens = tokens.filter(s => s.trim().length > 0);

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

const captureState = (index, selectedToken, tokens, operator_stack, output_stack) => ({
    index,
    selectedToken,
    tokens: [...tokens],
    operator_stack: [...operator_stack],
    output_stack: [...output_stack],
});

export const infixToPostfix = (infix, seq = []) => {
    let infixTokens = toTokens(infix).reverse();

    const stack = [];
    let postfixExpr = [];

    console.log('Tokens: ', infixTokens);

    while (infixTokens.length > 0) {
        seq.push(captureState(0, '', infixTokens, stack, postfixExpr));
        const token = infixTokens.pop();
        seq.push(captureState(1, token, infixTokens, stack, postfixExpr));
        if (prec(token) > 0) {
            seq.push(captureState(2, token, infixTokens, stack, postfixExpr));
            let topToken = stack.length !== 0? stack[stack.length - 1] : '';
            
            if (stack.length === 0 || topToken === '(') {
                seq.push(captureState(3, token, infixTokens, stack, postfixExpr));
                seq.push(captureState(4, token, infixTokens, stack, postfixExpr));
                stack.push(token);
            } else if (token === '(') {
                seq.push(captureState(5, token, infixTokens, stack, postfixExpr));
                seq.push(captureState(6, token, infixTokens, stack, postfixExpr));
                stack.push(token);
            } else if (token === ')') {
                seq.push(captureState(7, token, infixTokens, stack, postfixExpr));
                while (topToken !== '(') {
                    seq.push(captureState(8, token, infixTokens, stack, postfixExpr));
                    seq.push(captureState(9, token, infixTokens, stack, postfixExpr));
                    postfixExpr.push(stack.pop());
                    topToken = stack.length !== 0? stack[stack.length - 1] : '';
                    if (stack.length === 0){
                        seq.map(instr => console.log(infixToPostfixInstructions[instr]));
                        return '';
                    }
                }
                seq.push(captureState(10, token, infixTokens, stack, postfixExpr));
                stack.pop();
            } else if (prec(token) > prec(topToken)) {
                seq.push(captureState(11, token, infixTokens, stack, postfixExpr));
                seq.push(captureState(12, token, infixTokens, stack, postfixExpr));
                stack.push(token);
            } else if (prec(token) <= prec(topToken)) {
                seq.push(captureState(13, token, infixTokens, stack, postfixExpr));
                seq.push(captureState(14, token, infixTokens, stack, postfixExpr));
                postfixExpr.push(stack.pop());
                topToken = stack.length !== 0? stack[stack.length - 1] : '';
                while (stack.length > 0 && topToken !== '(' && prec(token) <= prec(topToken)) {
                    seq.push(captureState(15, token, infixTokens, stack, postfixExpr));
                    seq.push(captureState(16, token, infixTokens, stack, postfixExpr));
                    postfixExpr.push(stack.pop());
                    topToken = stack.length !== 0? stack[stack.length - 1] : '';
                }
                seq.push(captureState(17, token, infixTokens, stack, postfixExpr));
                stack.push(token);
            }
        } else {
            seq.push(captureState(18, token, infixTokens, stack, postfixExpr));
            seq.push(captureState(19, token, infixTokens, stack, postfixExpr));
            postfixExpr.push(token);
        }

        if(infixTokens.length === 0){
            seq.push(captureState(20, token, infixTokens, stack, postfixExpr));
            while(stack.length > 0) {
                postfixExpr.push(stack.pop());
            }
            seq.push(captureState(-1, '', infixTokens, stack, postfixExpr));
        }
    }
    
    return postfixExpr.join(' ');
};
