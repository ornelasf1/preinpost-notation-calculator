import {UPDATE_INFIX_EXPRESSION} from './ConversionActionTypes';
import {UPDATE_PREFIX_EXPRESSION} from './ConversionActionTypes';
import {UPDATE_POSTFIX_EXPRESSION} from './ConversionActionTypes';

export const actionUpdatePostExpr = expression => ({
    type: UPDATE_POSTFIX_EXPRESSION,
    payload: expression
});

export const actionUpdatePreExpr = expression => ({
    type: UPDATE_PREFIX_EXPRESSION,
    payload: expression
});

export const actionUpdateInExpr = expression => ({
    type: UPDATE_INFIX_EXPRESSION,
    payload: expression
});


export const updateInfixExpr = expr => dispatch => {
    console.log(`dispatch action with ${expr}`);
    dispatch(actionUpdateInExpr(expr));
};

export const updatePostfixExpr = expr => dispatch => {
    console.log(`dispatch action with ${expr}`);
    dispatch(actionUpdatePostExpr(expr));
};
