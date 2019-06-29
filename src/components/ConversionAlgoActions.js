import { SET_INFIX_TO_POSTFIX_INSTRUCTIONS } from "./ConversionAlgoActionTypes";


const setInstructionsInToPost = instructions => ({
    type: SET_INFIX_TO_POSTFIX_INSTRUCTIONS,
    payload: instructions,
});


export const setInfixToPostfixSeq = instructions => dispatch => {
    dispatch(setInstructionsInToPost(instructions));
}