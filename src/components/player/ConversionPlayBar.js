
import React from 'react';
import {connect} from 'react-redux';
import Slider from 'react-input-slider';
import './ConversionPlayBar.css';
import {ReactComponent as PlayIcon} from '../../play.svg';
import {ReactComponent as PauseIcon} from '../../pause.svg';
import {ReactComponent as ForwardIcon} from '../../../src/imgs/forward_arrow.svg';
import {ReactComponent as RewindIcon} from '../../../src/imgs/rewind_arrow.svg';
import { ConversionPlayerSlide } from './ConversionPlayerSlide';

class ConversionPlayBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isPlaying: false,
            instructionIndex: -1,
            disableRewind: true,
            disableForward: false,
        }
        this.playSeq = undefined;
        this.playSeqEnded = false;
    }

    componentDidUpdate = (prevProps) => {
        const { selectedNotation, instructionSequenceLimit, conversion: {valid} } = this.props;
        
        if (this.playSeq && !valid) {
            this.resetPlayer();
        }
        if (prevProps.conversion.expressions[selectedNotation]
            !== this.props.conversion.expressions[selectedNotation]) {
                this.resetPlayer();
            }

        const newInstructionIndex = this.state.instructionIndex < instructionSequenceLimit?
            this.state.instructionIndex : 0;
        this.props.updateSelectedInstruction(newInstructionIndex, instructionSequenceLimit);
    }

    resetPlayer = (playEnded = false) => {
        this.setState({
            isPlaying: false,
            instructionIndex: !this.playSeqEnded && playEnded ? this.props.instructionSequenceLimit - 1 : -1,
            disableRewind: this.playSeqEnded && playEnded,
            disableForward: !this.playSeqEnded && playEnded,
        }, () => {
            if (this.playSeq) {
                this.playSeq = undefined;
            }
            this.playSeqEnded = this.state.instructionIndex === this.props.instructionSequenceLimit - 1;
        });
    }

    handlePlayBtn = () => {
        this.setState({
            isPlaying: !this.state.isPlaying,
            disableRewind: this.state.instructionIndex === -1,
        });

        if (this.playSeq === undefined) {
            console.log('PLAYER: Initiate player');
            this.playSeq = new Timer(() => {
                console.log('PLAYER: RUNNING');
                this.setState({
                    instructionIndex: this.state.instructionIndex + 1,
                    disableRewind: this.state.instructionIndex === -1,
                }, () => {
                    if (this.playSeq !== undefined) {
                        this.playSeq.setIndex(this.state.instructionIndex);
                        console.log('PLAYER: Compare sequence index to sequence length: ', this.playSeq.getIndex(), this.props.instructionSequenceLimit);
                        if (this.playSeq.getIndex() === this.props.instructionSequenceLimit) {
                            console.log('PLAYER: Reset player');
                            this.resetPlayer(true);
                        }

                    }
                });
            }, this.props.instructionSequenceLimit, this.state.instructionIndex, 500);

        } else {
            if (this.state.isPlaying) {
                console.log('PLAYER: Pause')
                this.playSeq.pause();
            } else {
                console.log('PLAYER: Resume')
                this.playSeq.resume();
            }
        }
    }

    handleForwardBtn = () => {
        const newInstructionIndex = this.state.instructionIndex + 1 < this.props.instructionSequenceLimit?
            this.state.instructionIndex + 1 : this.state.instructionIndex;
        this.setState({
            isPlaying: false,
            disableForward: newInstructionIndex + 1 === this.props.instructionSequenceLimit,
            disableRewind: false,
            instructionIndex: newInstructionIndex,
        });
    }

    handleRewindBtn = () => {
        const newInstructionIndex = this.state.instructionIndex - 1 <= -1? -1: this.state.instructionIndex - 1;
        this.setState({
            isPlaying: false,
            disableRewind: newInstructionIndex === -1,
            disableForward: false,
            instructionIndex: newInstructionIndex,
        });
    }

    render = () => {
        const { isPlaying, disableForward, disableRewind } = this.state;
        const { instructionSequenceLimit,  conversion: { valid }} = this.props;

        if (this.playSeq && !isPlaying) {
            this.playSeq.pause();
        }

        return (
            <div className='playerHeader'>
                <ConversionPlayerSlide 
                    disabled={!valid}
                    min={-1}
                    max={instructionSequenceLimit - 1}
                    value={this.state.instructionIndex}
                    onChange={value => 
                        this.setState({
                            isPlaying: false,
                            disableRewind: value === -1,
                            disableForward: value === instructionSequenceLimit - 1,
                            instructionIndex: parseInt(value)})
                    }
                    handlePlayBtn={this.handlePlayBtn}
                    isPlaying={isPlaying}/>
                <div id="playerToolbar">
                      <button 
                        id='rewindBtn' 
                        className={'toolbarBtn' + (disableRewind? ' disableBtn' : '')}
                        onClick={this.handleRewindBtn} 
                        disabled={disableRewind}>
                          <RewindIcon />
                      </button>
                      <button 
                        id='forwardBtn' 
                        className={'toolbarBtn' + (disableForward? ' disableBtn' : '')}
                        onClick={this.handleForwardBtn} 
                        disabled={disableForward}>
                          <ForwardIcon />
                          </button>  
                </div>
            </div>
        );
    }
}

function Timer(callback, amountOfIntructions, initInstructionIndex, interval) {
    var timerId;
    var instructionIndex = initInstructionIndex;

    this.setIndex = newInstructionIndex => {
        console.log(`PLAYER: Update Index ${instructionIndex} with ${newInstructionIndex}`);
        instructionIndex = newInstructionIndex;
    };

    this.getIndex = () => instructionIndex;

    this.pause = () => {
        clearTimeout(timerId);
    };

    this.resume = () => {
        console.log('PLAYER: INTERVAL - ', instructionIndex);
        console.log('PLAYER: Compare index with # of instructions: ', instructionIndex, amountOfIntructions)
        if (instructionIndex < amountOfIntructions) {
            callback();
            timerId = setTimeout(() => {
                this.resume();
            }, interval);
        } else {
            console.log('PLAYER: End');
            clearTimeout(timerId);
        }
    };
    this.resume();
}

const mapStateToProps = state => ({
    algorithm: state.algorithmInstructions,
    conversion: state.conversionNotat,
});

export default connect(mapStateToProps)(ConversionPlayBar);