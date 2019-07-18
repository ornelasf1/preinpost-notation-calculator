
import React from 'react';
import './ConversionPlayBar.css';
import {ReactComponent as PlayIcon} from '../../play.svg';

export class ConversionPlayBar extends React.Component {
    render = () => {
        return (
            <div id='progressBar'>
                <button id='playBtn'><PlayIcon/> </button>
                <div class='meter'>
                    <span></span>
                </div>
            </div>
        );
    }
}