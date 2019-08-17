
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
    }

    componentDidUpdate = (prevProps) => {
        const { selectedNotation, toNotation } = this.props;
        if (prevProps.conversion.expressions[selectedNotation]
            !== this.props.conversion.expressions[selectedNotation]) {
                this.resetPlayer();
            }

        const instructionSequence = this.getInstructionSequence(selectedNotation, toNotation);
        const newInstructionIndex = this.state.instructionIndex < instructionSequence.length?
            this.state.instructionIndex : 0;
        this.props.updateSelectedInstruction(newInstructionIndex);
    }

    resetPlayer = () => {
        this.playSeq = undefined;
        this.setState({
            isPlaying: false,
            instructionIndex: -1,
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
        const { selectedNotation, toNotation } = this.props;
        const instructionSequence = this.getInstructionSequence(selectedNotation, toNotation);

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
                        console.log('Compare outside: ', this.playSeq.getIndex(), instructionSequence.length);
                        if (this.playSeq.getIndex() === instructionSequence.length) {
                            console.log('reset');
                            this.setState({
                                isPlaying: false, 
                                instructionIndex: -1,
                                disableRewind: true,
                                disableForward: false,
                            });
                            this.playSeq = undefined;
                        }

                    }
                });
            }, instructionSequence.length, this.state.instructionIndex, 500);

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
        const { selectedNotation, toNotation} = this.props;
        const instructionSequence = this.getInstructionSequence(selectedNotation, toNotation);
        const instructionSequenceLimit = instructionSequence.length;
        const newInstructionIndex = this.state.instructionIndex + 1 < instructionSequenceLimit?
            this.state.instructionIndex + 1 : this.state.instructionIndex;
        this.setState({
            isPlaying: false,
            disableForward: newInstructionIndex + 1 === instructionSequenceLimit,
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
        const instructionSequence = this.getInstructionSequence(selectedNotation, toNotation);
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
                        xmax={instructionSequence.length - 1}
                        x={this.state.instructionIndex}
                        onChange={({x}) => {
                            this.setState({
                                isPlaying: false,
                                disableRewind: x === -1,
                                disableForward: x === instructionSequence.length - 1,
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