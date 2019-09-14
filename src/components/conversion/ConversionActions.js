import {
    UPDATE_EXPRESSIONS, 
    UPDATE_SELECTED_NOTATION, 
    UPDATE_TO_NOTATION, 
    UDPATE_NOTATION_VALIDATION} from './ConversionActionTypes';


const actionUpdateExprs = expressions => ({
    type: UPDATE_EXPRESSIONS,
    payload: expressions
})

const actionUpdateSelected = notation => ({
    type: UPDATE_SELECTED_NOTATION,
    payload: notation,
});

const actionUpdateTo = notation => ({
    type: UPDATE_TO_NOTATION,
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

export const updateToNotation = notation => dispatch => {
    dispatch(actionUpdateTo(notation));
};

export const updateNotationValidation = validity => dispatch => {
    dispatch(actionUpdateNotationValidation(validity));
}
