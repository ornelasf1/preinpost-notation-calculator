import React from 'react';

import './component.css';



export class NotationFix extends React.Component{
    render = () => {
        return (
            <div className='component'>
                <h1>{this.props.type}</h1>
                <form name={this.props.type} onSubmit={e => e.preventDefault()}>
                    <input 
                        name={this.props.type}
                        className={'input-comp' + (!this.props.valid ? ' error-outline' : '')} 
                        onKeyDown={this.props.handleKeyDown} 
                        onChange={this.props.handleChange} 
                        value={this.props.expr}/>
                    <span className='input-underline'></span>
                    {this.props.children}
                </form>
            </div>
        );
    }
};

