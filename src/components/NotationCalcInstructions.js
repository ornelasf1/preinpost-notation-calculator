
import React from 'react';
import { prec } from './NotationCalc';

const helperMessages = {
    inputTokensMsg: (data = {}) => <div>Have all the input tokens been scanned through?</div>,
    tokenTypeMsg: (data = {}) => <div>Is <div className="helpItem">{data.selectedToken}<span className="helpText"><span>Prec</span>{prec(data.selectedToken)}</span></div> an OPERATOR or an OPERAND?</div>,
    comparePrecMsg: (data = {}) => <div>Does <div className="helpItem">{data.selectedToken}</div> have a greater precendence than <div className="helpItem">{data.topOfStack}</div>?</div>,
};



export const infixToPostfixInstructions = [
    'Is the list of tokens empty?',
    'XConsider token from the set of tokens',
    'XIf the token is an operator:',
    'XXIf the operator stack is empty or the top of the operator stack is a \'(\'',
    'XXXPush the selected token to the operator stack',
    'XXIf the selected token is a \'(\'',
    'XXXPush the selected token to the operator stack',
    'XXIf the selected token is \')\'',
    'XXXWhile the top of the operator stack is not a \'(\'',
    'XXXXPop the token from the top of the operator stack and output it',
    'XXXRemove the \'(\' from the top of the operator stack',
    'XXIf the selected token has a higher precedence than the token on the top of the operator stack',
    'XXXPush the selected token to the operator stack',
    'XXIf the selected token has a lower or equal precedence than the token on the top of the operator stack',
    'XXXPop the token from the top of the operator stack and output it',
    'XXXWhile the operator stack is not empty and the top of the operator stack is not a \'(\' and the selected token has a lower or equal precedence than the token on the top of the operator stack',
    'XXXXPop the token from the top of the operator stack and output it',
    'XXXPush the selected token to the operator stack',
    'XIf the token is an operand:',
    'XXOutput the selected token',
    'Output all remaining tokens from the operator stack when out of tokens'
];
export const helpmsgInfixMappings = {
    inputTokensMsg: [0],
    tokenTypeMsg: [1, 2, 18],
    comparePrecMsg: [11, 12, 13],
};


export const lookupHelperMsgs = (instructionIndex, helpmsgMappings) => {
    var selectedMsg = null;
    Object.keys(helpmsgMappings).forEach(msg => {
        if (helpmsgMappings[msg].includes(instructionIndex)) {
            selectedMsg = msg;
        }
    });
    return selectedMsg !== null ? helperMessages[selectedMsg] : null;
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