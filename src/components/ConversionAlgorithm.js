
import React from 'react';
import {connect} from 'react-redux';

import * as ConversionAlgoActions from './ConversionAlgoActions';

import './ConversionAlgorithm.css';
import { infixToPostfix } from './NotationCalc';
import { instructionIndents, getInstructionSet } from './NotationCalcInstructions';
import { ConversionPlayer } from './player/ConversionPlayer';
import ConversionPlayBar from './player/ConversionPlayBar';

class ConversionAlgorithm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            toNotation: '',
            instructions: [],
            selectedInstruction: {
                index: -1,
                selectedToken: '',
                selectedTokenIndex: -1,
                inputTokens: [],
                outputTokens: [],
                stackTokens: [],
            }
        };
    }

    calculateSequences = () => {
        let sequence = [];
        infixToPostfix(this.props.conversion.expressions.infix, sequence);
        this.props.setInfixToPostfixSeq(sequence);
    };

    updateSelectedInstruction = selectedInstructionIndex => {
        const { toPostInstr } = this.props.algorithm.infixInstr;
        this.setState({selectedInstruction: toPostInstr[selectedInstructionIndex]});
    }

    handleNotationButtons = (_, selected, toNotation) => {
        this.setState({toNotation, instructions: getInstructionSet(selected, toNotation)});
        this.calculateSequences();
        const notationComps = document.getElementById('conversion-comp');
        if (notationComps.style.animationName === '') {
            notationComps.style.animationName = 'elevateBoxes';
        }
    }

    getResultExpression = () => {
        if (this.state.toNotation === 'postfix') {
            return this.props.conversion.expressions.postfix;
        } else if (this.state.toNotation === 'infix') {
            return this.props.conversion.expressions.infix;
        } else if (this.state.toNotation === 'infix') {
            return this.props.conversion.expressions.prefix;
        } else {
            return '';
        }
    }

    render = () => {
        const {selectedNotation, expressions} = this.props.conversion;
        const {toNotation} = this.state;

        const instructions = this.state.instructions.map((instr, i) => (<Instruction key={i} uniqueKey={i} selected={this.state.selectedInstruction.index}>{instr}</Instruction>));

        return (
            <div className='display'>
                {selectedNotation !== '' && <ToNotationButtons selected={selectedNotation} toNotation={toNotation} handleClick={this.handleNotationButtons}/>}
                {this.state.toNotation !== '' && 
                <div id='body' style={selectedNotation !== '' && {animationName: 'dropdownBody'}}>
                    <div className='algorithm-display' >
                        {instructions}
                    </div>
                    <div className='canvas'>
                        <ConversionPlayBar updateSelectedInstruction={this.updateSelectedInstruction}/>
                        <ConversionPlayer className='player' expression={expressions[selectedNotation]} selectedInstr={this.state.selectedInstruction} />
                    </div>
                </div>}
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

const ToNotationButtons = props => {
    let notations = ['prefix', 'infix', 'postfix'];
    notations = notations.filter(fix => fix !== props.selected);
    
    return (
        <div id='toNotation-buttons'>
            <button onClick={(e => props.handleClick(e, props.selected, notations[0]))}>To {notations[0]}</button>
            <button onClick={(e => props.handleClick(e, props.selected, notations[1]))}>To {notations[1]}</button>
        </div>
    );
};

const mapStateToProps = state => ({
    algorithm: state.algorithmInstructions,
    conversion: state.conversionNotat,
});

export default connect(mapStateToProps, ConversionAlgoActions)(ConversionAlgorithm);