
import {UPDATE_EXPRESSIONS} from './ConversionActionTypes';

export const defaultState = {
    expressions: {
        postfixexpr: '',
        infixexpr: '',
        prefixexpr: '',
    }
}

export const conversionNotat = (state = defaultState, action) => {
    switch(action.type){
        case UPDATE_EXPRESSIONS:
            return {
                expressions: {
                    ...action.payload
                }
            };
        default:
            return state;
    }
}