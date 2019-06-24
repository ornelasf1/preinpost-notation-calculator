import React from 'react';
import {connect} from 'react-redux';
import * as ConversionActions from './ConversionActions';
import './component.css';

class Infix extends React.Component{
    constructor(props){
        super(props);
        this.state = {expression: ''};
    }

    onChange = event => {
        this.setState({expression: event.target.value + ' '});
    };

    handleKeyDown = event => {
        let value = event.target.value;
        if (value !== '' && event.key === 'Backspace'){
            this.setState({expression: value.substr(0, value.length - 1)});
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        this.props.updateExpression(this.state.expression);
    };

    render = () => {
        return (
            <div className='component'>
                <h1>Infix</h1>
                <form onSubmit={this.handleSubmit}>
                    <input className='input-comp' onKeyDown={this.handleKeyDown} onChange={this.onChange} value={this.state.expression}/>
                    <span className='input-underline'></span>
                </form>
            </div>
        );
    }
};

export const mapStateToProps = state => ({
    expression: state.conversionNotat.expression
});

export default connect(mapStateToProps, ConversionActions)(Infix);