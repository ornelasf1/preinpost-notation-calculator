
import {UPDATE_EXPRESSION} from './ConversionActionTypes';

export const defaultState = {
    expression: ''
}

export const conversionNotat = (state = defaultState, action) => {
    switch(action.type){
        case UPDATE_EXPRESSION:
            return {
                ...state,
                expression: action.payload 
            };
        default:
            return state;
    }
}