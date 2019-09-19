
import { infixToPostfixInstructions } from './NotationCalcInstructions';


export const validateExpression = (notation, expression) => {
    console.log('Validating expression: ', expression);
    if (notation === 'infix') {
        const infixToPostfixResult = infixToPostfix(expression);
        const infixToPrefixResult = infixToPrefix(expression);

        const infixDelimitedBySpaces = toTokens(expression, 'infix').filter(token => token !== '(' && token !== ')').join(' ');

        console.log(`Orig. Infix: ${infixDelimitedBySpaces} PostfixToInfix: ${postfixToInfix(infixToPostfixResult)} PrefixToInfix: ${prefixToInfix(infixToPrefixResult)}`);
        return postfixToInfix(infixToPostfixResult) === infixDelimitedBySpaces
            && prefixToInfix(infixToPrefixResult) === infixDelimitedBySpaces;
    } else if (notation === 'postfix') {
        /* 
        Postfix to Infix conversion requires parentheses because there is no ambiguity with postfix
         4 6 + 8 -  -->  4 + 6 - 8
         4 6 + 8 *  -->  (4 + 6) * 8
        */
        const postfixToInfixResult = postfixToInfix(expression, [], true);
        const postfixToPrefixResult = postfixToPrefix(expression);
        console.log('POSTFIX: PostfixToInfix: ', postfixToInfixResult, ' PostfixToPrefix: ', postfixToPrefixResult);

        const postfixDelimitedBySpaces = toTokens(expression).filter(token => token !== '(' && token !== ')').join(' ');

        console.log(`Orig. Postfix: ${postfixDelimitedBySpaces} InfixToPostfix: ${infixToPostfix(postfixToInfixResult)} PrefixToPostfix: ${prefixToPostfix(postfixToPrefixResult)}`);
        return infixToPostfix(postfixToInfixResult) === postfixDelimitedBySpaces
            && prefixToPostfix(postfixToPrefixResult) === postfixDelimitedBySpaces;
    } else if (notation === 'prefix') {
        
    }
}

export const toTokens = (input, toNotation = '') => {
    if(typeof input !== 'string') return '';
    let tokens = input.trim();

    // Only works for infix expressions that are seperated by operators in between of operands
    if (toNotation === 'infix') {
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
    } else { // Requires postfix and prefix expressions to be delmited by spaces
        tokens = tokens.split(' ');
    }
    tokens = tokens.map(s => s.trim()).filter(s => s.trim().length > 0);
    console.log('toTokens return: ', toNotation, tokens);

    return tokens;
};

export const prec = operator => {
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
    let infixTokens = toTokens(infix, 'infix').reverse();

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
            
            if (cs(3) && (stack.length === 0 || topToken === '(')) {
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

//Input: string postfix expression. user input has to be delimited by space
//Output: string delimimted by spaces
export const postfixToInfix = (postfix, seq = [], includeParentheses = false) => {
    console.log(`Convert postfix to infix: ${postfix}`);
    const postfixTokens = toTokens(postfix).reverse();
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
            if (includeParentheses && postfixTokens.length !== 0) {
                stack.push('(' + firstOperand + ' ' + token + ' ' + secondOperand + ')');
            } else {
                stack.push(firstOperand + ' ' + token + ' ' + secondOperand);
            }
            infixExpr = [];
        } else {
            stack.push(token);
        }
    }
    console.log('postfix to infix result: ', stack.reverse().join(' '));
    return stack.reverse().join(' ');
};

//Input: string infix expression. doesn't have to be delimited by a space
//Output: string delimimted by spaces
export const infixToPrefix = (infix, seq = []) => {
    
    let infixTokens = toTokens(infix, 'infix').reverse();
    infixTokens = swapParentheses(infixTokens);

    let prefixExpr = infixToPostfix(infixTokens.join(' '), seq);
    
    seq.forEach(capturedState => {
        if (capturedState.index !== -1) {
            capturedState.index += 2;
        }
    });
    prefixExpr = prefixExpr.split(' ').reverse().join(' ');
    console.log(`Prefix expression: ${prefixExpr}`);
    return prefixExpr;
};

const swapParentheses = expression => {
    if (!Array.isArray(expression)) {
        return expression;
    }

    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === ')') {
            expression[i] = '(';
        } else if (expression[i] === '(') {
            expression[i] = ')';
        }
    }
    return expression;
}

//Input: string prefix expression. user input has to be delimited by space
//Output: string delimimted by spaces
export const prefixToInfix = (prefix, seq = []) => {
    let prefixTokens = toTokens(prefix).reverse();
    prefixTokens = prefixTokens.join(' ');

    let infixExpr = postfixToInfix(prefixTokens).split(' ').reverse().join(' ');
    console.log(`Prefix ${prefix} To Infix: ${infixExpr}`);
    return infixExpr;
}

export const postfixToPrefix = (postfix, seq = [], includeParentheses = false) => {
    console.log('POSTFIX TO PREFIX: Start with ', postfix);
    let postfixTokens = toTokens(postfix).reverse();
    const stack = [];
    let prefixExpr = [];

    console.log('postfix being converted to prefix: ', postfixTokens);
    while (postfixTokens.length > 0) {
        const token = postfixTokens.pop();
        if (prec(token) > 0) {
            const secondOperand = stack.pop();
            prefixExpr.push(secondOperand);

            prefixExpr.push(token);

            const firstOperand = stack.pop();
            prefixExpr.push(firstOperand);
            if (includeParentheses) {
                stack.push('(' + token + ' ' + firstOperand + ' ' + secondOperand + ')');
            } else {
                stack.push(token + ' ' + firstOperand + ' ' + secondOperand);
            }
            prefixExpr = [];
        } else {
            stack.push(token);
        }
    }
    console.log('Postfix to prefix result: ', stack.reverse().join(' '));
    return stack.reverse().join(' ');
}

export const prefixToPostfix = (prefix, seq = [], includeParentheses = false) => {
    console.log(`Convert prefix to postfix: ${prefix}`);
    const prefixTokens = toTokens(prefix);
    const stack = [];
    let postfixExpr = [];

    console.log('prefix being converted to postfix: ', prefixTokens);
    while (prefixTokens.length > 0) {
        const token = prefixTokens.pop();
        if (prec(token) > 0) {
            const secondOperand = stack.pop();
            postfixExpr.push(secondOperand);

            postfixExpr.push(token);

            const firstOperand = stack.pop();
            postfixExpr.push(firstOperand);
            if (includeParentheses) {
                stack.push('(' + secondOperand + ' ' + firstOperand + ' ' + token + ')');
            } else {
                stack.push(secondOperand + ' ' + firstOperand + ' ' + token);
            }
            postfixExpr = [];
        } else {
            stack.push(token);
        }
    }
    console.log('prefix to postfix result: ', stack.reverse().join(' '));
    return stack.reverse().join(' ');
}