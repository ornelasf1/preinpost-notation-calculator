import React from 'react';

import './component.css';



export class NotationFix extends React.Component{

    handleSubmit = event => {
        event.preventDefault();
        console.log(document);
        // this.props.submitExpr(event);
    };

    render = () => {
        return (
            <div className='component'>
                <h1>{this.props.type}</h1>
                <form name={this.props.type} onSubmit={this.handleSubmit}>
                    <input 
                        name={this.props.type}
                        className='input-comp' 
                        onKeyDown={this.props.handleKeyDown} 
                        onChange={this.props.handleChange} 
                        value={this.props.expr}/>
                    <span className='input-underline'></span>
                </form>
            </div>
        );
    }
};

