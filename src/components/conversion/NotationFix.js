import React from 'react';

import './component.css';



export class NotationFix extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            expr: ''
        }
    }

    render = () => {
        return (
            <div className='component'>
                <h1>{this.props.type}</h1>
                <form name={this.props.type} onSubmit={this.props.submitExpr}>
                    <input 
                        name={this.props.type}
                        className='input-comp' 
                        onKeyDown={this.props.onKeyDown} 
                        onChange={this.props.handleChange} 
                        value={this.props.expr}/>
                    <span className='input-underline'></span>
                </form>
            </div>
        );
    }
};

