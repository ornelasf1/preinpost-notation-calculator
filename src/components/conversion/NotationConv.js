import React from 'react';
import {connect} from 'react-redux';

import * as ConversionActions from './ConversionActions';
import * as ConversionAlgoActions from '../ConversionAlgoActions';
import {NotationFix} from './NotationFix';
import {infixToPostfix, toTokens, validateExpression, infixToPrefix} from '../NotationCalc';

export class NotationConv extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            infix: '',
            prefix: '',
            postfix: '',
        };
    }

    handleChange = event => {
        const notationFix = event.target.name.toLowerCase();
        this.setState({[notationFix]: event.target.value});
        let sequence = [];
        if (notationFix === 'infix') {
            //Valdation of infix expression
            if (validateExpression(notationFix, event.target.value)) {
                this.props.updateNotationValidation(true);
                this.setState({
                    postfix: infixToPostfix(event.target.value, sequence),
                    prefix: infixToPrefix(event.target.value),
                },
                    this.props.setInfixToPostfixSeq(sequence));
            } else {
                this.props.updateNotationValidation(false);
                this.setState({postfix: ''});
            }
        }

        this.props.updateSelectedNotation(notationFix);
        this.setState({}, () => this.props.updateExpressions({
            ...this.state,
            infix: toTokens(this.state.infix).join(' '),
        }));

    };

    render = () => {
        return (
            <div id='conversion-comp'>
                <NotationFix 
                    type='Prefix' 
                    expr={this.state.prefix} 
                    handleChange={this.handleChange}/>
                <NotationFix 
                    type='Infix' 
                    expr={this.state.infix} 
                    handleChange={this.handleChange}/>
                <NotationFix 
                    type='Postfix' 
                    expr={this.state.postfix} 
                    handleChange={this.handleChange}/>
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