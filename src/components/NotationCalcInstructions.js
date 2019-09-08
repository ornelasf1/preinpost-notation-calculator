
import React from 'react';
import { prec } from './NotationCalc';

export const switchActiveStructures = (id = '') => {
    const activeTokens = document.getElementsByClassName('activeStructure');
    while (activeTokens.length !== 0) {
        activeTokens[0].classList.remove('activeStructure');
    }
    if (id !== '') {
        document.getElementById(id).classList.add('activeStructure');
    }
}

const switchActiveTokens = (id = '') => {
    const activeTokens = document.getElementsByClassName('activeStructure');
    while (activeTokens.length !== 0) {
        activeTokens[0].classList.remove('activeStructure');
    }
    if (id !== '') {
        var token = document.getElementById(id);
        var activeTokenBorder = document.createElement('span');
        activeTokenBorder.style.position = 'absolute';
        activeTokenBorder.style.borderRadius = '100%';
        activeTokenBorder.style.width = (parseFloat(getComputedStyle(token).width.replace('px','')) - 20) + 'px';
        activeTokenBorder.style.height = (parseFloat(getComputedStyle(token).height.replace('px','')) - 20) + 'px';
        activeTokenBorder.style.left = '10px';
        activeTokenBorder.style.top = '14px';
        activeTokenBorder.className = 'activeStructure';
        token.appendChild(activeTokenBorder);
    }
}

const helperMessages = {
    inputTokensMsg: (data = {}) => {
        switchActiveStructures('tokens');
        return (<div>Have all the input tokens been scanned through?</div>);
    },
    tokenTypeMsg: (data = {}) => {
        switchActiveStructures();
        return (
            <div>
                Is <div className="helpItem">{data.selectedToken}
                    <span className="helpText"><span>Prec</span>{prec(data.selectedToken)}</span>
                </div> an OPERATOR or an OPERAND?
            </div>
        );
    },
    comparePrecMsg: (data = {}) => {
        switchActiveStructures();
        switchActiveTokens('stacktoken-'+data.topOfStackIndex);
        return (
            <div>
                Does <div className="helpItem">{data.selectedToken}
                    <span className="helpText"><span>Prec</span>{prec(data.selectedToken)}</span>
                </div> have a greater precendence than 
                <div className="helpItem">{data.topOfStack}
                    <span className="helpText"><span>Prec</span>{prec(data.topOfStack)}</span>
                </div>?
            </div>);
    },
    stackEmptyOrTopMsg: (data = {}) => {
        switchActiveStructures('stack');
        return (
            <div>
                Review the contents of the stack.
            </div>
        );
    },
    outputRemaingTokensMsg: (data = {}) => {
        switchActiveStructures('stack');
        return (
            <div>
                All tokens have been scanned through, pop all remaining tokens from the stack to the output.
            </div>
        );
    },
    finishMsg: (data = {}) => {
        switchActiveStructures('output');
        return (<div>Done!</div>);
    },
};



export const infixToPostfixInstructions = [
    'Is the list of tokens empty?',
    'XConsider token from the set of tokens',
    'XIf the token is an operator:',
    'XXIf the operator stack is empty OR the top of the operator stack is a \'(\'',
    'XXXPush the selected token to the operator stack',
    'XXIf the selected token is a \'(\'',
    'XXXPush the selected token to the operator stack',
    'XXIf the selected token is \')\'',
    'XXXWhile the top of the operator stack is not a \'(\'',
    'XXXXPop the token from the top of the operator stack AND output it',
    'XXXRemove the \'(\' from the top of the operator stack',
    'XXIf the selected token has a higher precedence than the token on the top of the operator stack',
    'XXXPush the selected token to the operator stack',
    'XXIf the selected token has a lower OR equal precedence than the token on the top of the operator stack',
    'XXXPop the token from the top of the operator stack AND output it',
    'XXXWhile the operator stack is not empty AND the top of the operator stack is not a \'(\' AND the selected token has a lower OR equal precedence than the token on the top of the operator stack',
    'XXXXPop the token from the top of the operator stack AND output it',
    'XXXPush the selected token to the operator stack',
    'XIf the token is an operand:',
    'XXOutput the selected token',
    'Output all remaining tokens from the operator stack when out of tokens'
];
export const helpmsgInfixMappings = {
    inputTokensMsg: [0],
    tokenTypeMsg: [1, 2, 18, 19],
    comparePrecMsg: [11, 12, 13],
    stackEmptyOrTopMsg: [3, 4],
    outputRemaingTokensMsg: [20],
    finishMsg: [-1],
};


export const lookupHelperMsgs = (instructionIndex, helpmsgMappings, condition) => {
    var selectedMsg = null;
    Object.keys(helpmsgMappings).forEach(msg => {
        if (helpmsgMappings[msg].includes(instructionIndex)) {
            selectedMsg = msg;
        }
    });
    if (selectedMsg !== null){
        if (instructionIndex === -1 && condition) {
            return helperMessages[selectedMsg];
        } else if (instructionIndex !== -1){
            return helperMessages[selectedMsg];
        } else {
            return null;
        }
    }
}

export const instructionIndents = instr => {
    let indents = 0;
    let first = instr.split(' ')[0];
    [...first].forEach(c => {
        if (c === 'X') indents++;
    });
    return indents;
};

export const getInstructionSet = (notation, toNotation) => {
    if(notation === 'infix'){
        if (toNotation === 'prefix') {
            return [];
        } else if (toNotation === 'postfix') {
            return infixToPostfixInstructions;
        }
    }
};