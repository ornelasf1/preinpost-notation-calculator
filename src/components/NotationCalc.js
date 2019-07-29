
import { infixToPostfixInstructions } from './NotationCalcInstructions';


export const validateExpression = (notation, expression) => {
    if (notation === 'infix') {
        const infixToPostfixResult = infixToPostfix(expression);
        const infixDelimitedBySpaces = toTokens(expression).filter(token => token !== '(' && token !== ')').join(' ');
        return postfixToInfix(infixToPostfixResult) === infixDelimitedBySpaces;
    } else if (notation === 'postfix') {

    } else if (notation === 'prefix') {
        
    }
}

export const toTokens = input => {
    if(typeof input !== 'string') return '';
    let tokens = input.trim();

    tokens = tokens.split('').reduce((acc, curr) => {
        if (acc.length === 0) {
            acc.push(curr);
        } else {
            const top = acc[acc.length - 1];
            if (prec(top) === 4 && prec(curr) === 4){
                acc.push(curr);
            } else if (prec(top) === prec(curr)){
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
        case '−':
            return 1;
        case '*':
        case '×':
        case '/':
        case '÷':
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

//Input: string infix expression. doesn't have to be delimited by space
//Output: string delimimted by spaces
export const infixToPostfix = (infix, seq = []) => {
    let infixTokens = toTokens(infix).reverse();

    var tokenIndex = -1;
    const stack = [];
    let postfixExpr = [];

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
    postfixToInfix(postfixExpr.join(' '));
    return postfixExpr.join(' ');
};

//Input: string postfix expression. has to be delimited by a space
//Output: string delimimted by spaces
export const postfixToInfix = postfix => {
    const postfixTokens = postfix.split(' ').reverse();
    const stack = [];
    let infixExpr = [];

    console.log('postfix being converted: ', postfixTokens);
    while (postfixTokens.length > 0) {
        const token = postfixTokens.pop();
        if (prec(token) > 0) {
            const secondOperand = stack.pop();
            infixExpr.push(secondOperand);

            infixExpr.push(token);

            const firstOperand = stack.pop();
            infixExpr.push(firstOperand);
            stack.push(firstOperand + ' ' + token + ' ' + secondOperand);
            infixExpr = [];
        } else {
            stack.push(token);
        }
    }
    console.log('postfix to infix result: ', stack.reverse().join(' '));
    return stack.reverse().join(' ');
};
