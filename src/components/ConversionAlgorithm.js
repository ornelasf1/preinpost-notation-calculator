
import React from 'react';
import {connect} from 'react-redux';

import * as ConversionAlgoActions from './ConversionAlgoActions';
import * as ConversionActions from './conversion/ConversionActions';

import './ConversionAlgorithm.css';
import { instructionIndents, getInstructionSet } from './NotationCalcInstructions';
import { ConversionPlayer } from './player/ConversionPlayer';
import ConversionPlayBar from './player/ConversionPlayBar';

class ConversionAlgorithm extends React.Component {

    constructor(props){
        super(props);
        this.defaultSelectedInstr = {
            index: -1,
            selectedToken: '',
            selectedTokenIndex: -1,
            inputTokens: [],
            outputTokens: [],
            stackTokens: [],
        };
        this.state = {
            toNotation: '',
            instructions: [],
            selectedInstruction: this.defaultSelectedInstr,
            selectedInstructionIndex: -1,
        };
    }

    componentDidUpdate() {
        const {selectedNotation, toNotation} = this.props.conversion;
        if (selectedNotation && toNotation && this.state.instructions.length === 0) {
            this.setState({instructions: getInstructionSet(selectedNotation, toNotation)});
        }
    }

    updateSelectedInstruction = selectedInstructionIndex => {
        const { toPostInstr } = this.props.algorithm.infixInstr;
        if (selectedInstructionIndex === -1) {
            this.setState({selectedInstruction: this.defaultSelectedInstr, 
                selectedInstructionIndex });
        } else {
            this.setState({selectedInstruction: toPostInstr[selectedInstructionIndex],
                selectedInstructionIndex });
        }
    }

    handleNotationButtons = (_, selected, toNotation) => {
        this.props.updateToNotation(toNotation);
        this.setState({toNotation, instructions: getInstructionSet(selected, toNotation)});
        const notationComps = document.getElementsByClassName('App-content')[0];
        const appTitle = document.getElementById('app-title');
        if (notationComps.style.animationName === '') {
            notationComps.style.animationName = 'elevateBoxes';
            appTitle.style.fontSize = '50px';
            appTitle.style.marginBottom = '0px';
            appTitle.style.marginLeft = '10px';
        }
    }

    getResultExpression = () => {
        if (this.state.toNotation === 'postfix') {
            return this.props.conversion.expressions.postfix;
        } else if (this.state.toNotation === 'infix') {
            return this.props.conversion.expressions.infix;
        } else if (this.state.toNotation === 'prefix') {
            return this.props.conversion.expressions.prefix;
        } else {
            return '';
        }
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

    resetToNotation = () => {
        this.props.updateToNotation('');
    }

    render = () => {
        const {selectedNotation, expressions, valid, toNotation} = this.props.conversion;
        const { selectedInstructionIndex } = this.state;

        const instructionSequence = this.getInstructionSequence(selectedNotation, toNotation);

        const instructions = this.state.instructions.map(
            (instr, i) => (
                <Instruction 
                    key={i} 
                    uniqueKey={i} 
                    selected={this.state.selectedInstruction.index}>
                {instr}
                </Instruction>));

        if (!toNotation) {
            return null;
        }

        return (
            <div className='display'>
                <div id='content'>
                    <div id='header'>
                        <button onClick={this.resetToNotation}>Close</button>
                    </div>
                    <div id='body'>
                        <div className='algorithm-display'>
                            {instructions}
                        </div>
                        <div className='canvas'>
                            <ConversionPlayBar 
                                updateSelectedInstruction={this.updateSelectedInstruction}
                                selectedNotation={selectedNotation}
                                toNotation={toNotation}
                                instructionSequenceLimit={instructionSequence.length} />
                            <ConversionPlayer 
                                className='player' 
                                expression={expressions[selectedNotation]} 
                                selectedInstr={this.state.selectedInstruction}
                                selectedNotation={selectedNotation}
                                toNotation={toNotation}
                                selectedInstructionIndex={selectedInstructionIndex}
                                instructionSequenceLimit={instructionSequence.length} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

const Instruction = props => {
    const selectedStyle = props.selected === props.uniqueKey? '-selected' : '';
    const indents = instructionIndents(props.children);
    const pad = {
        "paddingLeft": (10 + indents * 15) + 'px'
    }
    
    return (
        <div className={'instruction' + selectedStyle} style={pad}>
            {props.children.substr(indents)}
        </div>
    );
};

const mapStateToProps = state => ({
    algorithm: state.algorithmInstructions,
    conversion: state.conversionNotat,
});

export const actionCreators = {
    ...ConversionActions,
    ...ConversionAlgoActions,
}

export default connect(mapStateToProps, actionCreators)(ConversionAlgorithm);