
import {UPDATE_INFIX_EXPRESSION, UPDATE_POSTFIX_EXPRESSION, UPDATE_PREFIX_EXPRESSION} from './ConversionActionTypes';

export const defaultState = {
    postfixexpr: '',
    infixexpr: '',
    prefixexpr: '',
}

export const conversionNotat = (state = defaultState, action) => {
    switch(action.type){
        case UPDATE_INFIX_EXPRESSION:
            return {
                ...state,
                infixexpr: action.payload 
            };
        case UPDATE_POSTFIX_EXPRESSION:
            return {
                ...state,
                postfixexpr: action.payload 
            };
        default:
            return state;
    }
}