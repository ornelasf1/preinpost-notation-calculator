
import {UPDATE_EXPRESSIONS, UPDATE_SELECTED_NOTATION} from './ConversionActionTypes';

export const defaultState = {
    expressions: {
        postfixexpr: '',
        infixexpr: '',
        prefixexpr: '',
    },
    selectedNotation: ''
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
        default:
            return state;
    }
}