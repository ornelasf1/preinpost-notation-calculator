
import React from 'react';
import {ReactComponent as PlayIcon} from '../../imgs/play.svg';
import {ReactComponent as PauseIcon} from '../../imgs/pause.svg';

import './ConversionPlayerSlide.css';

export const ConversionPlayerSlide = props => {
    return (
        <div id='progressBar'>
            <button disabled={props.disabled} id='playBtn' onClick={props.handlePlayBtn}>
                {props.isPlaying? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className="slideContainer">
                <input 
                    className="slider"
                    type="range"
                    disabled={props.disabled}
                    min={props.min} 
                    max={props.max}
                    value={props.value}
                    onChange={event => {
                        props.onChange(event.target.value);
                        console.log(`Change to: ${event.target.value}`);
                        }}>
                </input>
            </div>
        </div>
    );
}