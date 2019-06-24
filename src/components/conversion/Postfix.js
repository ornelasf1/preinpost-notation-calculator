
import React from 'react';
import './component.css';


export const Prefix = (props) => {

    return (
        <div className='component'>
            <h1>Prefix</h1>
            <form onSubmit={props.onSubmit}>
                <input 
                    className='input-comp' 
                    onKeyDown={props.handleKeyDown} 
                    onChange={props.onChange} 
                    value={props.value}/>
                <span className='input-underline'></span>
            </form>
        </div>
    );
};


export class Postfix extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            expr: ''
        }
    }

    handleChange = event => {
        this.setState({expr: event.target.value + ' '});
    };

    render = () => {
        return (
            <div className='component'>
                <h1>Postfix</h1>
                <form name='postfix' onSubmit={this.props.onSubmit}>
                    <input 
                        name='input'
                        className='input-comp' 
                        onKeyDown={this.props.handleKeyDown} 
                        onChange={this.handleChange} 
                        value={this.state.expr}/>
                    <span className='input-underline'></span>
                </form>
            </div>
        );
    }
};