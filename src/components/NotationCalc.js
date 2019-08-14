
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

    var token = '';
    var tokenIndex = -1;
    const stack = [];
    let postfixExpr = [];

    const cs = (index, selectedToken = token) => seq.push(captureState(index, selectedToken, tokenIndex, infixTokens, stack, postfixExpr)); 

    while (infixTokens.length > 0) {
        cs(0);
        token = infixTokens.pop();
        tokenIndex++;
        cs(1);
        if (cs(2) && prec(token) > 0) {
            let topToken = stack.length !== 0? stack[stack.length - 1] : '';
            
            if (cs(3) && stack.length === 0 || topToken === '(') {
                cs(4);
                stack.push(token);
            } else if (cs(5) && token === '(') {
                cs(6);
                stack.push(token);
            } else if (cs(7) && token === ')') {
                while (cs(8) && topToken !== '(') {
                    cs(9);
                    postfixExpr.push(stack.pop());
                    topToken = stack.length !== 0? stack[stack.length - 1] : '';
                    if (stack.length === 0){
                        seq.map(instr => console.log(infixToPostfixInstructions[instr]));
                        return '';
                    }
                }
                cs(10);
                stack.pop();
            } else if (cs(11) && prec(token) > prec(topToken)) {
                cs(12);
                stack.push(token);
            } else if (cs(13) && prec(token) <= prec(topToken)) {
                cs(14);
                postfixExpr.push(stack.pop());
                topToken = stack.length !== 0? stack[stack.length - 1] : '';
                while (cs(15) && stack.length > 0 && topToken !== '(' && prec(token) <= prec(topToken)) {
                    cs(16);
                    postfixExpr.push(stack.pop());
                    topToken = stack.length !== 0? stack[stack.length - 1] : '';
                }
                cs(17);
                stack.push(token);
            }
        } else if(cs(18)) {
            cs(19);
            postfixExpr.push(token);
        }

        if(infixTokens.length === 0){
            cs(20);
            while(stack.length > 0) {
                postfixExpr.push(stack.pop());
                cs(20);
            }
            tokenIndex = -1;
            cs(-1, '');
        }
    }

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
