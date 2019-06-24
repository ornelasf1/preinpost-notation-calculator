import React from 'react';

import './component.css';



export class Infix extends React.Component{
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
                <h1>Infix</h1>
                <form name='infix' onSubmit={this.props.onSubmit}>
                    <input 
                        name='input'
                        className='input-comp' 
                        onKeyDown={this.props.onKeyDown} 
                        onChange={this.handleChange} 
                        value={this.state.expr}/>
                    <span className='input-underline'></span>
                </form>
            </div>
        );
    }
};

