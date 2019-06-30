import {UPDATE_EXPRESSIONS, UPDATE_SELECTED_NOTATION} from './ConversionActionTypes';


export const actionUpdateExprs = expressions => ({
    type: UPDATE_EXPRESSIONS,
    payload: expressions
})

export const actionUpdateSelected = notation => ({
    type: UPDATE_SELECTED_NOTATION,
    payload: notation,
});

export const updateExpressions = exprs => dispatch => {
    dispatch(actionUpdateExprs(exprs));
}

export const updateSelectedNotation = notation => dispatch => {
    dispatch(actionUpdateSelected(notation));
};
