
import React from 'react';
import _ from 'underscore';
import './ConversionPlayer.css';

export class ConversionPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            inputTokens: [],
            outputTokens: [],
            stackTokens: [],
            selectedTokenIndex: -1,
        };
    }

    componentDidMount = () => {
        const cursorPos = this.getCoords(document.getElementById('tokens'));
        const cursor = document.getElementById('tokenCursor');
        cursor.style.left = cursorPos.left + 'px';
        cursor.style.top = cursorPos.top + cursorPos.height + 'px';
    }

    componentDidUpdate = prevProps => {
        console.log('Update Covnersion Player');
        this.updateInputTokens(prevProps);
        this.updateStackTokens(prevProps);
        this.updateOutputTokens(prevProps);
    }

    getCoords = elem => {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + window.pageYOffset,
            left: box.left + window.pageXOffset,
            height: box.height,
        };
    }

    updateInputTokens = prevProps => {
        if (prevProps.selectedInstr.tokens !== this.props.selectedInstr.tokens
            && this.state.inputTokens.length === 0) {
                this.setState({inputTokens: this.props.selectedInstr.tokens.reverse()});
        }
        else if (!_.isEmpty(prevProps.selectedInstr) && !_.isEmpty(this.props.selectedInstr) && 
                prevProps.selectedInstr.tokens.length !== this.props.selectedInstr.tokens.length && prevProps.selectedInstr.index !== -1) {
            const nextTokenIdx = this.state.selectedTokenIndex + 1;
            this.setState({selectedTokenIndex: nextTokenIdx}, () => this.updateTokenCursor(this.state.selectedTokenIndex));
        } else if (Object.keys(this.props.selectedInstr) !== 0 && this.props.selectedInstr.index === -1 
                && this.state.selectedTokenIndex !== -1) {
            this.setState({selectedTokenIndex: -1}, () => this.updateTokenCursor(this.state.selectedTokenIndex));
        }
    }

    updateStackTokens = prevProps => {
        if ((!_.isUndefined(this.props.selectedInstr.operator_stack) && !_.isUndefined(prevProps.selectedInstr.operator_stack))
            && prevProps.selectedInstr.operator_stack.length !== this.props.selectedInstr.operator_stack.length) {
                this.setState({stackTokens: this.props.selectedInstr.operator_stack});
            }
    }

    updateOutputTokens = prevProps => {
        if ((!_.isUndefined(this.props.selectedInstr.output_stack) && !_.isUndefined(prevProps.selectedInstr.output_stack))
            && prevProps.selectedInstr.output_stack.length !== this.props.selectedInstr.output_stack.length) {
                this.setState({outputTokens: this.props.selectedInstr.output_stack});
            }
    }

    updateTokenCursor = (index) => {
        const tokenCursor = document.getElementById('tokenCursor');
        if (index === 0) {
            tokenCursor.style.display = 'block';
        }else if (index === -1) {
            tokenCursor.style.display = 'none';
            return;
        }
        const nextCursorLocation = document.getElementById("token-"+index);
        const nextCursorCoords = this.getCoords(nextCursorLocation);
        tokenCursor.style.left = nextCursorCoords.left + "px";
        tokenCursor.style.top = (nextCursorCoords.top + nextCursorCoords.height) + "px";
    }

    render = () => {
        const expressionTokens = this.props.expression.split('');
        const divInputTokens = expressionTokens.map((token, idx) => <div key={idx} id={"token-"+idx}>{token}</div>);
        const divStackTokens = this.state.stackTokens.map((token, idx) => <div key={idx}>{token}</div>);
        const divOutputTokens = this.state.outputTokens.map((token, idx) => <div key={idx}>{token}</div>);


        return (
            <div className='player'>
                <div id='tokenCursor'></div>
                <div id='tokens'>
                    {divInputTokens}
                </div>
                <div id='structures'>
                    <div id='stack'>
                        {divStackTokens}
                    </div>
                    <div id='output'>
                        {divOutputTokens}
                    </div>
                </div>
            </div>
        );
    };
}
