import {UPDATE_EXPRESSION} from './ConversionActionTypes';

export const actionUpdateExpression = expression => ({
    type: UPDATE_EXPRESSION,
    payload: expression
});


export const updateExpression = expr => dispatch => {
    console.log(`dispatch action with ${expr}`);
    dispatch(actionUpdateExpression(expr));
};
