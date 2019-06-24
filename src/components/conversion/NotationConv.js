import React from 'react';
import { Postfix, Prefix } from './Postfix';
import Infix from './Infix';

export class NotationConv extends React.Component{



    render = () => {
        return (
            <div className='conversion-comp'>
                <Prefix />
                <Infix />
                <Postfix />
            </div>
        );
    };
}