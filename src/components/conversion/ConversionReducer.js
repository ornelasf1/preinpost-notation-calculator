
import {
    UPDATE_EXPRESSIONS, 
    UPDATE_SELECTED_NOTATION, 
    UPDATE_TO_NOTATION,
    UDPATE_NOTATION_VALIDATION,
} from './ConversionActionTypes';

export const defaultState = {
    expressions: {
        postfixexpr: '',
        infixexpr: '',
        prefixexpr: '',
    },
    selectedNotation: '',
    toNotation: '',
    valid: true,
}

export const conversionNotat = (state = defaultState, action) => {
    switch(action.type){
        case UPDATE_EXPRESSIONS:
            return {
                ...state,
                expressions: {
                    ...action.payload
                }
            };
        case UPDATE_SELECTED_NOTATION:
            return {
                ...state,
                selectedNotation: action.payload,
            };
        case UPDATE_TO_NOTATION:
            return {
                ...state,
                toNotation: action.payload,
            };
        case UDPATE_NOTATION_VALIDATION:
            return {
                ...state,
                valid: action.payload,
            }
        default:
            return state;
    }
}