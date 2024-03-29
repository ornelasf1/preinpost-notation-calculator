import React from 'react';
import {connect} from 'react-redux';
import ReactGA from 'react-ga';

import * as ConversionActions from './ConversionActions';
import * as ConversionAlgoActions from '../ConversionAlgoActions';
import NotationFix from './NotationFix';
import {infixToPostfix, toTokens, validateExpression, infixToPrefix, postfixToInfix, postfixToPrefix, prefixToInfix, prefixToPostfix} from '../NotationCalc';

export class NotationConv extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            infix: '',
            prefix: '',
            postfix: '',
        };
        this.expressionConvertedTimeout = null;
    }

    sendGAExpressionConvertedFrom = (notation, expression, expressionValidGA) => {
        clearTimeout(this.expressionConvertedTimeout);
        if (expression.trim('') !== '') {
            this.expressionConvertedTimeout = setTimeout(() => {
                ReactGA.event({
                    category: 'Converted - ' + (expressionValidGA? 'Valid' : 'Invalid'),
                    action: 'Expression converted from ' + notation,
                    label: notation + ': [ ' + expression + ' ]',
                });
            }, 10000);
        }
    }

    handleChange = event => {
        const notationFix = event.target.name.toLowerCase();
        this.setState({[notationFix]: event.target.value});
        let sequence = [];
        let isExpressionValid = validateExpression(notationFix, event.target.value);
        this.props.updateToNotation('');
        if (notationFix === 'infix') {
            //Valdation of infix expression
            if (isExpressionValid) {
                this.props.updateNotationValidation(true);
                this.setState({
                    postfix: infixToPostfix(event.target.value, sequence),
                    prefix: infixToPrefix(event.target.value),
                },
                    this.props.setInfixToPostfixSeq(sequence));
            } else {
                this.props.updateNotationValidation(false);
                this.setState({
                    postfix: '',
                    prefix: '',
                });
            }
        } else if (notationFix === 'postfix') {
            //Valdation of postfix expression
            if (isExpressionValid) {
                this.props.updateNotationValidation(true);
                this.setState({
                    infix: postfixToInfix(event.target.value, [], true), // Postfix to Infix conversion requires parentheses because there is no ambiguity with postfix
                    prefix: postfixToPrefix(event.target.value),
                },
                // this.props.setInfixToPostfixSeq(sequence) For v2.
                );
            } else {
                this.props.updateNotationValidation(false);
                this.setState({
                    infix: '',
                    prefix: '',
                });
            }
        } else if (notationFix === 'prefix') {
            //Valdation of prefix expression
            if (isExpressionValid) {
                this.props.updateNotationValidation(true);
                this.setState({
                    infix: prefixToInfix(event.target.value, [], true), // Prefix to Infix conversion requires parentheses because there is no ambiguity with prefix
                    postfix: prefixToPostfix(event.target.value),
                },
                // this.props.setInfixToPrefixSeq(sequence) For v2.
                );
            } else {
                this.props.updateNotationValidation(false);
                this.setState({
                    infix: '',
                    postfix: '',
                });
            }
        }

        this.sendGAExpressionConvertedFrom(notationFix, event.target.value, isExpressionValid);
        this.props.updateSelectedNotation(event.target.value.trim() !== '' ? notationFix : '');
        this.setState({}, () => this.props.updateExpressions({
            ...this.state,
            infix: toTokens(this.state.infix, 'infix').join(' '),
            //TODO: postfix, prefix, for v2
        }));

    };

    render = () => {
        const { valid, selectedNotation } = this.props.conversion;

        return (
            <div id='conversion-comp'>
                <NotationFix 
                    type='Prefix'
                    placeholder={'+ A B'} 
                    selectedNotation={selectedNotation}
                    valid={valid}
                    expr={this.state.prefix} 
                    handleChange={this.handleChange}>
                    {this.state.prefix.length > 2 && selectedNotation === 'prefix'? 
                        <span className="helpTip">Remember to split your operands with SPACES</span> 
                        : null}
                </NotationFix>
                <NotationFix 
                    type='Infix'
                    placeholder={'A + B'}
                    selectedNotation={selectedNotation}
                    valid={valid}
                    expr={this.state.infix} 
                    handleChange={this.handleChange}/>
                <NotationFix 
                    type='Postfix'
                    placeholder={'A B +'}
                    selectedNotation={selectedNotation}
                    valid={valid} 
                    expr={this.state.postfix} 
                    handleChange={this.handleChange}>
                    {this.state.postfix.length > 2 && selectedNotation === 'postfix'? 
                    <span className="helpTip">Remember to split your operands with SPACES</span> 
                    : null}
                </NotationFix>
            </div>
        );
    };
}


export const mapStateToProps = state => ({
    conversion: state.conversionNotat
});

export const actionCreators = {
    ...ConversionActions,
    ...ConversionAlgoActions,
}

export default connect(mapStateToProps, actionCreators)(NotationConv);