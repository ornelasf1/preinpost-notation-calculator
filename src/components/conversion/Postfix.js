
import React from 'react';
import './component.css';

export const Prefix = () => {
    return (
        <div className='component'>
            <h1>Prefix</h1>
            <form>
                <input className='input-comp'/>
                <span className='input-underline'></span>
            </form>
        </div>
    );
};

export const Postfix = () => {
    return (
        <div className='component'>
            <h1>Postfix</h1>
            <form>
                <input className='input-comp'/>
                <span className='input-underline'></span>
            </form>
        </div>
    );
};