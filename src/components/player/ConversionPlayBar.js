
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

    handlePlayBtn = () => {
        this.setState({isPlaying: !this.state.isPlaying});

        if (this.playSeq === undefined) {
            const { toPostInstr } = this.props.algorithm.infixInstr;
            console.log('Initiated');
            this.playSeq = new Timer(() => {
                console.log('RUNNING');
                this.props.updateSelectedInstruction(this.state.instructionIndex);
                this.setState({instructionIndex: this.state.instructionIndex + 1}, () => {
                    if (this.playSeq !== undefined) {
                        this.playSeq.setIndex(this.state.instructionIndex);
                        console.log('Compare outside: ', this.playSeq.getIndex(), toPostInstr.length);
                        if (this.playSeq.getIndex() === toPostInstr.length) {
                            console.log('reset');
                            this.setState({isPlaying: false, instructionIndex: 0});
                            this.playSeq = undefined;
                        }

                    }
                    console.log('State updated: ', this.state.instructionIndex);
                });
            }, toPostInstr.length, this.state.instructionIndex, 1000);

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
        const { toPostInstr } = this.props.algorithm.infixInstr;

        return (
            <div id='progressBar'>
                <button id='playBtn' onClick={this.handlePlayBtn}>
                    {isPlaying? <PauseIcon /> : <PlayIcon />}
                </button>
                <Slider 
                    id='slider'
                    axis="x"
                    xstep={1}
                    xmin={0}
                    xmax={toPostInstr.length - 1}
                    x={this.state.instructionIndex}
                    onChange={({x}) => {
                        this.setState({isPlaying: false, instructionIndex: x}, this.props.updateSelectedInstruction(this.state.instructionIndex))
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