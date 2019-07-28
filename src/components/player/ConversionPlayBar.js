
import React from 'react';
import {connect} from 'react-redux';
import Slider from 'react-input-slider';
import './ConversionPlayBar.css';
import {ReactComponent as PlayIcon} from '../../play.svg';
import {ReactComponent as PauseIcon} from '../../pause.svg';

class ConversionPlayBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isPlaying: false,
            instructionIndex: 0,
        }
        this.playSeq = undefined;
    }

    resetPlayer = () => {
        this.playSeq = undefined;
        this.setState({
            isPlaying: false,
            instructionIndex: 0,
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

        this.setState({isPlaying: !this.state.isPlaying});

        if (this.playSeq === undefined) {
            console.log('Initiated');
            this.playSeq = new Timer(() => {
                console.log('RUNNING');
                this.props.updateSelectedInstruction(this.state.instructionIndex);
                this.setState({instructionIndex: this.state.instructionIndex + 1}, () => {
                    if (this.playSeq !== undefined) {
                        this.playSeq.setIndex(this.state.instructionIndex);
                        console.log('Compare outside: ', this.playSeq.getIndex(), instructionSequence.length);
                        if (this.playSeq.getIndex() === instructionSequence.length) {
                            console.log('reset');
                            this.setState({isPlaying: false, instructionIndex: 0});
                            this.playSeq = undefined;
                        }

                    }
                    console.log('State updated: ', this.state.instructionIndex);
                });
            }, instructionSequence.length, this.state.instructionIndex, 1000);

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

    render = () => {
        const { isPlaying } = this.state;
        const { selectedNotation, toNotation,  conversion: { valid }} = this.props;
        const instructionSequence = this.getInstructionSequence(selectedNotation, toNotation);
        if (this.playSeq && !isPlaying) {
            this.playSeq.pause();
        }

        return (
            <div id='progressBar'>
                <button disabled={!valid} id='playBtn' onClick={this.handlePlayBtn}>
                    {isPlaying? <PauseIcon /> : <PlayIcon />}
                </button>
                <Slider 
                    id='slider'
                    disabled={!valid}
                    axis="x"
                    xstep={1}
                    xmin={0}
                    xmax={instructionSequence.length - 1}
                    x={this.state.instructionIndex}
                    onChange={({x}) => {
                        this.setState({
                            isPlaying: false, 
                            instructionIndex: x}, 
                            this.props.updateSelectedInstruction(this.state.instructionIndex))
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