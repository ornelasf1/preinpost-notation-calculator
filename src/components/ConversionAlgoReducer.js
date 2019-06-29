import { SET_INFIX_TO_POSTFIX_INSTRUCTIONS } from "./ConversionAlgoActionTypes";

const defaultState = {
    infixInstr: {
        toPostInstr: [],
        toPreInstr: [],
    },
    postfixInstr: {
        toPreInstr: [],
        toInInstr: [],
    },
    prefixInstr: {
        toInInstr: [],
        toPostIntr: [],
    }
};

export const algorithmInstructions = (state = defaultState, action) => {
    switch(action.type){
        case SET_INFIX_TO_POSTFIX_INSTRUCTIONS:
            return {
                ...state,
                infixInstr: {
                    ...state.infixInstr,
                    toPostInstr: action.payload
                }
            }
        default:
            return state;
    }
};