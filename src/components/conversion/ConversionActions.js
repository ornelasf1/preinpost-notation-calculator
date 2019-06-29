import {UPDATE_EXPRESSIONS} from './ConversionActionTypes';


export const actionUpdateExprs = expressions => ({
    type: UPDATE_EXPRESSIONS,
    payload: expressions
})

export const updateExpressions = exprs => dispatch => {
    console.log(`dispatch action with ${exprs}`);
    dispatch(actionUpdateExprs(exprs));
}
