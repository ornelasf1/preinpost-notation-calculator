import React from 'react';
import {connect} from 'react-redux';

import * as ConversionActions from './ConversionActions';
import { Postfix, Prefix } from './Postfix';
import {Infix} from './Infix';

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
        this.setState({[event.target.name]: event.target.value + ' '});
    };

    handleKeyDown = event => {
        let value = event.target.value;
        console.log(value);
        if (value !== '' && event.key === 'Backspace'){
            this.setState({[event.target.name]: value.substr(0, value.length - 1)});
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
                <NotationFix type='Prefix'/>
                <NotationFix type='Infix' submitExpr={this.props.updateInfixExpr} expr={this.state.infix} handleChange={this.handleChange} handleKeyDown={this.handleKeyDown}/>
                <NotationFix type='Postfix'/>
            </div>
        );
    };
}


export const mapStateToProps = state => ({
    conversion: state.conversionNotat
});

export default connect(mapStateToProps, ConversionActions)(NotationConv);