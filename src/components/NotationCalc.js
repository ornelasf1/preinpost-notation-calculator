
import { infixToPostfixInstructions } from './NotationCalcInstructions';


export const toTokens = input => {
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

const captureState = (index, selectedToken, selectedTokenIndex, inputTokens, operatorTokens, outputTokens) => ({
    index,
    selectedToken,
    selectedTokenIndex,
    inputTokens: [...inputTokens],
    stackTokens: [...operatorTokens],
    outputTokens: [...outputTokens],
});

export const infixToPostfix = (infix, seq = []) => {
    let infixTokens = toTokens(infix).reverse();

    var tokenIndex = -1;
    const stack = [];
    let postfixExpr = [];

    console.log('Tokens: ', infixTokens);

    while (infixTokens.length > 0) {
        seq.push(captureState(0, '', tokenIndex, infixTokens, stack, postfixExpr));
        const token = infixTokens.pop();
        tokenIndex++;
        seq.push(captureState(1, token, tokenIndex, infixTokens, stack, postfixExpr));
        if (prec(token) > 0) {
            seq.push(captureState(2, token, tokenIndex, infixTokens, stack, postfixExpr));
            let topToken = stack.length !== 0? stack[stack.length - 1] : '';
            
            if (stack.length === 0 || topToken === '(') {
                seq.push(captureState(3, token, tokenIndex, infixTokens, stack, postfixExpr));
                seq.push(captureState(4, token, tokenIndex, infixTokens, stack, postfixExpr));
                stack.push(token);
            } else if (token === '(') {
                seq.push(captureState(5, token, tokenIndex, infixTokens, stack, postfixExpr));
                seq.push(captureState(6, token, tokenIndex, infixTokens, stack, postfixExpr));
                stack.push(token);
            } else if (token === ')') {
                seq.push(captureState(7, token, tokenIndex, infixTokens, stack, postfixExpr));
                while (topToken !== '(') {
                    seq.push(captureState(8, token, tokenIndex, infixTokens, stack, postfixExpr));
                    seq.push(captureState(9, token, tokenIndex, infixTokens, stack, postfixExpr));
                    postfixExpr.push(stack.pop());
                    topToken = stack.length !== 0? stack[stack.length - 1] : '';
                    if (stack.length === 0){
                        seq.map(instr => console.log(infixToPostfixInstructions[instr]));
                        return '';
                    }
                }
                seq.push(captureState(10, token, tokenIndex, infixTokens, stack, postfixExpr));
                stack.pop();
            } else if (prec(token) > prec(topToken)) {
                seq.push(captureState(11, token, tokenIndex, infixTokens, stack, postfixExpr));
                seq.push(captureState(12, token, tokenIndex, infixTokens, stack, postfixExpr));
                stack.push(token);
            } else if (prec(token) <= prec(topToken)) {
                seq.push(captureState(13, token, tokenIndex, infixTokens, stack, postfixExpr));
                seq.push(captureState(14, token, tokenIndex, infixTokens, stack, postfixExpr));
                postfixExpr.push(stack.pop());
                topToken = stack.length !== 0? stack[stack.length - 1] : '';
                while (stack.length > 0 && topToken !== '(' && prec(token) <= prec(topToken)) {
                    seq.push(captureState(15, token, tokenIndex, infixTokens, stack, postfixExpr));
                    seq.push(captureState(16, token, tokenIndex, infixTokens, stack, postfixExpr));
                    postfixExpr.push(stack.pop());
                    topToken = stack.length !== 0? stack[stack.length - 1] : '';
                }
                seq.push(captureState(17, token, tokenIndex, infixTokens, stack, postfixExpr));
                stack.push(token);
            }
        } else {
            seq.push(captureState(18, token, tokenIndex, infixTokens, stack, postfixExpr));
            seq.push(captureState(19, token, tokenIndex, infixTokens, stack, postfixExpr));
            postfixExpr.push(token);
        }

        if(infixTokens.length === 0){
            seq.push(captureState(20, token, tokenIndex, infixTokens, stack, postfixExpr));
            while(stack.length > 0) {
                postfixExpr.push(stack.pop());
            }
            seq.push(captureState(-1, '', tokenIndex, infixTokens, stack, postfixExpr));
        }
    }
    
    return postfixExpr.join(' ');
};
