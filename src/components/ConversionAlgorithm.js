
import React from 'react';
import {connect} from 'react-redux';

import * as ConversionAlgoActions from './ConversionAlgoActions';

import './ConversionAlgorithm.css';
import { InfixAlgorithm, infixToPostfix } from './NotationCalc';
import { infixToPostfixInstructions, instructionIndents, getInstructionSet } from './NotationCalcInstructions';
import { ConversionPlayer } from './ConversionPlayer';

class ConversionAlgorithm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            toNotation: '',
            instructions: [],
            selectedInstruction: {}
        };
    }

    calculateSequences = () => {
        let sequence = [];
        infixToPostfix(this.props.conversion.expressions.infix, sequence);
        this.props.setInfixToPostfixSeq(sequence);
    };

    beginSequence = () => {
        new Promise(resolve => resolve(this.calculateSequences()))
            .then(() => {
                const { toPostInstr } = this.props.algorithm.infixInstr;
                const time = 1000 * toPostInstr.length;
                var instrIndex = 0;

                var playSeq = setInterval(() => {
                    this.setState({selectedInstruction: toPostInstr[instrIndex]});
                    instrIndex++;
                }, 1000);
                
                setTimeout(() => {clearTimeout(playSeq)}, time);
            });
        
    };

    handleNotationButtons = (_, selected, toNotation) => {
        this.setState({toNotation, instructions: getInstructionSet(selected, toNotation)});
    }

    render = () => {

        const {selectedNotation} = this.props.conversion;
        const instructions = this.state.instructions.map((instr, i) => (<Instruction key={i} uniqueKey={i} selected={this.state.selectedInstruction.index}>{instr}</Instruction>));

        return (
            <div className='display'>
                {selectedNotation !== '' && <ToNotationButtons selected={selectedNotation} toNotation={this.state.toNotation} handleClick={this.handleNotationButtons}/>}
                {this.state.toNotation !== '' && 
                <div className='body'>
                    <div className='algorithm-display' >
                        {instructions}
                    </div>
                    <div className='canvas'>
                        <button name='convert' onClick={this.beginSequence}>Convert</button>
                        <ConversionPlayer className='player' selectedInstr={this.state.selectedInstruction}></ConversionPlayer>
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
        <div className='toNotation-buttons'>
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