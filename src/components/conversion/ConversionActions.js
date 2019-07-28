import {UPDATE_EXPRESSIONS, UPDATE_SELECTED_NOTATION, UDPATE_NOTATION_VALIDATION} from './ConversionActionTypes';


const actionUpdateExprs = expressions => ({
    type: UPDATE_EXPRESSIONS,
    payload: expressions
})

const actionUpdateSelected = notation => ({
    type: UPDATE_SELECTED_NOTATION,
    payload: notation,
});

const actionUpdateNotationValidation = valid => ({
    type: UDPATE_NOTATION_VALIDATION,
    payload: valid,
});

export const updateExpressions = exprs => dispatch => {
    dispatch(actionUpdateExprs(exprs));
}

export const updateSelectedNotation = notation => dispatch => {
    dispatch(actionUpdateSelected(notation));
};

export const updateNotationValidation = validity => dispatch => {
    dispatch(actionUpdateNotationValidation(validity));
}
