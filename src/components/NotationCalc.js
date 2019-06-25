import React from 'react';

export class NotationCalc{
    
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

export const infixToPostfix = infix => {
    let infixTokens = toTokens(infix).reverse();
    console.log('Tokens: ', infixTokens);

    const stack = [];
    let postfixExpr = '';

    while (infixTokens.length > 0) {
        const token = infixTokens.pop();
        console.log(`Popped ${token}`);

        if (prec(token) > 0) {
            let topToken = stack.length !== 0? stack[stack.length - 1] : '';
            
            if (stack.length === 0 || topToken === '(') {
                stack.push(token);
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while (topToken !== '(') {
                    postfixExpr += stack.pop();
                    topToken = stack.length !== 0? stack[stack.length - 1] : '';
                    if (stack.length === 0) return '';
                }
                stack.pop();
            } else if (prec(token) > prec(topToken)) {
                stack.push(token);
            } else if (prec(token) <= prec(topToken)) {
                postfixExpr += stack.pop();
                topToken = stack.length !== 0? stack[stack.length - 1] : '';
                while (stack.length > 0 && prec(token) <= prec(topToken)) {
                    postfixExpr += stack.pop();
                }
                stack.push(token);
            }
        } else {
            postfixExpr += token;
        }

        if(infixTokens.length === 0){
            while(stack.length > 0) {
                postfixExpr += stack.pop();
            }
        }

    }
    return postfixExpr;
};
