export const reduxStore = {
    conversionNotat: {
        expressions: {
            postfixexpr: '',
            infixexpr: '',
            prefixexpr: '',
        },
        selectedNotation: '',
        valid: false,
    },
    algorithmInstructions: {
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
    },
};