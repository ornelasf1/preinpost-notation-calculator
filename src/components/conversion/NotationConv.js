import React from 'react';
import {connect} from 'react-redux';

import * as ConversionActions from './ConversionActions';
import { Postfix, Prefix } from './Postfix';
import {Infix} from './Infix';

export class NotationConv extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            infix_expr: '',
            prefix_expr: '',
            postfix_expr: '',
        };
    }



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
                <Prefix
                    onSubmit={this.handleSubmit} 
                    onKeyDown={this.handleKeyDown}/>
                <Infix 
                    onSubmit={this.handleSubmit} 
                    onKeyDown={this.handleKeyDown}/>
                <Postfix 
                    onSubmit={this.handleSubmit} 
                    onKeyDown={this.handleKeyDown}/>
            </div>
        );
    };
}


export const mapStateToProps = state => ({
    conversion: state.conversionNotat
});

export default connect(mapStateToProps, ConversionActions)(NotationConv);