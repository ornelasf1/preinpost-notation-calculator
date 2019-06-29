import React from 'react';
import {connect} from 'react-redux';

import * as ConversionActions from './ConversionActions';
import { Postfix, Prefix } from './Postfix';
import {Infix} from './Infix';
import {NotationFix} from './NotationFix';
import {infixToPostfix} from '../NotationCalc';

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

        if (notationFix === 'infix') {
            this.setState({postfix: infixToPostfix(event.target.value)});
        }
        this.setState({}, () => this.props.updateExpressions(this.state));

    };

    handleKeyDown = event => {
        let value = event.target.value;
        if (value !== '' && event.key === 'Backspace'){
            this.setState({[event.target.name.toLowerCase()]: value.substr(0, value.length - 2)});
        }
    };

    onChange = event => {
        this.setState({expression: event.target.value + ' '});
    };

    handleKeyDown = event => {
        let value = event.target.value;
        console.log(value);
        if (value !== '' && event.key === 'Backspace'){
            this.setState({expression: value.substr(0, value.length - 1)});
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        switch(event.target.name){
            case 'infix':
                this.props.updateInfixExpr(event.target.input.value);
                break;
            case 'postfix':
                this.props.updatePostfixExpr(event.target.input.value);
                break;
            case 'prefix':
                break;
            default:
                break;
        }
    };

    render = () => {
        return (
            <div className='conversion-comp'>
                <NotationFix type='Prefix' submitExpr={this.props.updatePrefixExpr} expr={this.state.prefix} handleChange={this.handleChange}/>
                <NotationFix type='Infix' submitExpr={this.props.updateInfixExpr} expr={this.state.infix} handleChange={this.handleChange}/>
                <NotationFix type='Postfix' submitExpr={this.props.updatePostfixExpr} expr={this.state.postfix} handleChange={this.handleChange}/>
            </div>
        );
    };
}


export const mapStateToProps = state => ({
    conversion: state.conversionNotat
});

export default connect(mapStateToProps, ConversionActions)(NotationConv);