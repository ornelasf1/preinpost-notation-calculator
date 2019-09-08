
import React from 'react';
import {connect} from 'react-redux';
import Slider from 'react-input-slider';
import './ConversionPlayBar.css';
import {ReactComponent as PlayIcon} from '../../play.svg';
import {ReactComponent as PauseIcon} from '../../pause.svg';
import {ReactComponent as ForwardIcon} from '../../../src/imgs/forward_arrow.svg';
import {ReactComponent as RewindIcon} from '../../../src/imgs/rewind_arrow.svg';

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
        this.instructionSequenceLimit = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { selectedNotation, toNotation, conversion: {valid} } = this.props;
        const { selectedNotation, conversion: {valid} } = this.props;
        
        if (this.playSeq && !valid) {
            this.resetPlayer();
        }
        if (prevProps.conversion.expressions[selectedNotation]
            !== this.props.conversion.expressions[selectedNotation]) {
                this.resetPlayer();
            }

        const newInstructionIndex = this.state.instructionIndex < this.instructionSequenceLimit?
            this.state.instructionIndex : 0;
        this.props.updateSelectedInstruction(newInstructionIndex);
    }

    resetPlayer = (playEnded = false) => {
        this.setState({
            isPlaying: false,
            instructionIndex: !this.playSeqEnded && playEnded ? this.instructionSequenceLimit - 1 : -1,
            disableRewind: true,
            disableForward: false,
        }, () => {
            if (this.playSeq) {
                this.playSeq = undefined;
            }
            this.playSeqEnded = this.state.instructionIndex === this.instructionSequenceLimit - 1;
        });
    }

    getInstructionSequence = (fromNotation, toNotation) => {
        const instructionSetName = fromNotation + 'Instr';
        const notationSequences = this.props.algorithm[instructionSetName];

        if (toNotation === 'prefix') {
            return notationSequences.toPreInstr;
        }else if (toNotation === 'infix') {
            return notationSequences.toInInstr;
        }else if (toNotation === 'postfix') {
            return notationSequences.toPostInstr;
        }
    }

    handlePlayBtn = () => {
        this.setState({
            isPlaying: !this.state.isPlaying,
            disableRewind: this.state.instructionIndex === -1,
        });

        if (this.playSeq === undefined) {
            console.log('Initiated');
            this.playSeq = new Timer(() => {
                console.log('RUNNING');
                this.setState({
                    instructionIndex: this.state.instructionIndex + 1,
                    disableRewind: this.state.instructionIndex === -1,
                }, () => {
                    if (this.playSeq !== undefined) {
                        this.playSeq.setIndex(this.state.instructionIndex);
                        console.log('Compare outside: ', this.playSeq.getIndex(), this.instructionSequenceLimit);
                        if (this.playSeq.getIndex() === this.instructionSequenceLimit) {
                            console.log('PLAYER: Reset player');
                            this.resetPlayer(true);
                        }

                    }
                });
            }, this.instructionSequenceLimit, this.state.instructionIndex, 500);

        } else {
            if (this.state.isPlaying) {
                console.log('pausing')
                this.playSeq.pause();
            } else {
                console.log('playing')
                this.playSeq.resume();
            }
        }
    }

    handleForwardBtn = () => {
        const newInstructionIndex = this.state.instructionIndex + 1 < this.instructionSequenceLimit?
            this.state.instructionIndex + 1 : this.state.instructionIndex;
        this.setState({
            isPlaying: false,
            disableForward: newInstructionIndex + 1 === this.instructionSequenceLimit,
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
        const { selectedNotation, toNotation,  conversion: { valid }} = this.props;
        
        this.instructionSequenceLimit = this.getInstructionSequence(selectedNotation, toNotation).length;

        if (this.playSeq && !isPlaying) {
            this.playSeq.pause();
        }

        return (
            <div>
                <div id='progressBar'>
                    <button disabled={!valid} id='playBtn' onClick={this.handlePlayBtn}>
                        {isPlaying? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <Slider 
                        id='slider'
                        disabled={!valid}
                        axis="x"
                        xstep={1}
                        xmin={-1}
                        xmax={this.instructionSequenceLimit - 1}
                        x={this.state.instructionIndex}
                        onChange={({x}) => {
                            this.setState({
                                isPlaying: false,
                                disableRewind: x === -1,
                                disableForward: x === this.instructionSequenceLimit - 1,
                                instructionIndex: x})
                        }}
                        styles={{
                            track: {
                                backgroundColor: '#143c41'
                              },
                              active: {
                                backgroundColor: '#1a484e'
                              },
                              thumb: {
                                width: 10,
                                height: 10,
                                top: '50%',
                              }
                        }}
                        />
                </div>
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
        console.log('index updated ', instructionIndex, newInstructionIndex);
        instructionIndex = newInstructionIndex;
    };

    this.getIndex = () => instructionIndex;

    this.pause = () => {
        clearTimeout(timerId);
    };

    this.resume = () => {
        console.log('INTERVAL: ', instructionIndex);
        console.log('Compare: ', instructionIndex, amountOfIntructions)
        if (instructionIndex < amountOfIntructions) {
            callback();
            timerId = setTimeout(() => {
                this.resume();
            }, interval);
        } else {
            console.log('END');
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