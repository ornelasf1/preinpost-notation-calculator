import React from 'react';
import { connect } from 'react-redux';

import './component.css';
import * as ConversionActions from './ConversionActions';



export class NotationFix extends React.Component{

    handleNotationButton = (toNotation) => {
        this.props.updateToNotation(toNotation);
    }

    render = () => {
        return (
            <div className='component'>
                <h1>{this.props.type}</h1>
                <form name={this.props.type} onSubmit={e => e.preventDefault()}>
                    <input 
                        name={this.props.type}
                        placeholder={this.props.placeholder}
                        className={'input-comp' + (!this.props.valid ? ' error-outline' : '')} 
                        onKeyDown={this.props.handleKeyDown} 
                        onChange={this.props.handleChange} 
                        value={this.props.expr}/>
                    <span className='input-underline'></span>
                    {this.props.children}
                </form>
                {this.props.selectedNotation === this.props.type.toLowerCase() && 
                    <HowToButtons 
                        type={this.props.type} 
                        valid={this.props.valid}
                        handleClick={this.handleNotationButton}/>}
            </div>
        );
    }
};

function HowToButtons (props) {
    let howToText = null;
    if (props.type === 'Infix') {
        howToText = {
            convertToOne: 'Prefix',
            convertToTwo: 'Postfix',
        }
    } else if (props.type === 'Postfix') {
        howToText = {
            convertToOne: 'Prefix',
            convertToTwo: 'Infix',
        }
    } else if (props.type === 'Prefix') {
        howToText = {
            convertToOne: 'Infix',
            convertToTwo: 'Postfix',
        }
    }

    if (howToText && props.type === 'Infix') { //WIP: Remove only Infix when other instructions are done
        return (
            <div className='how-to-buttons'>
                {false && <button 
                    className={props.valid ? '' : 'button-disabled'} 
                    onClick={() => props.handleClick(howToText.convertToOne.toLowerCase())}
                    disabled={!props.valid}>
                    Steps to {howToText.convertToOne}
                </button>}
                <button 
                    className={props.valid ? '' : 'button-disabled'}
                    onClick={() => props.handleClick(howToText.convertToTwo.toLowerCase())}
                    disabled={!props.valid}>
                    Steps to {howToText.convertToTwo}
                </button>
            </div>
        );
    } else {
        return null;
    }
}

export const actionCreators = {
    ...ConversionActions,
}

export default connect(null, actionCreators)(NotationFix);
