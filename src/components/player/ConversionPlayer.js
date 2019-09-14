
import React from 'react';
import './ConversionPlayer.css';
import { 
    lookupHelperMsgs, 
    getHelpMsgMappings
} from '../NotationCalcInstructions';

export class ConversionPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.lastestTopStack = {};
        this.helpMsg = null;

        this.state = {
            helperMessage: null,
        };
    }

    getSnapshotBeforeUpdate = prevProps => {
        const topStackIndex = prevProps.selectedInstr.stackTokens.length - 1;
        const topStackToken = document.getElementById('stacktoken-'+topStackIndex);
        this.latestTopStack = {
            left: topStackToken ? topStackToken.offsetLeft : 0,
            top: topStackToken ? topStackToken.offsetTop : 0,
            node: topStackToken,
        };
        
        const topOutputIndex = prevProps.selectedInstr.outputTokens.length - 1;
        this.lastTopOutputToken = document.getElementById('outputtoken-'+topOutputIndex);
        return null;
    }
    
    componentDidUpdate = prevProps => {
        this.resetActiveStructureAnimation();
        this.animateRemoveHelpMsg();
        if (prevProps.selectedInstr.selectedTokenIndex !==
            this.props.selectedInstr.selectedTokenIndex 
            || this.props.selectedInstr.selectedTokenIndex === -1) {
                this.animateTokenCursor(this.props.selectedInstr.selectedTokenIndex);
            }
        try{
            this.animateTokens(prevProps.selectedInstr, this.props.selectedInstr);
        } catch(e) {
            console.log("Uh oh breaky", e);
        }

        if (prevProps.selectedInstr.index !== this.props.selectedInstr.index) {
            // this.setState({helperMessage: });
        }
    }

    animateTokenCursor = index => {
        const tokenCursor = document.getElementById('tokenCursor');
        if (tokenCursor === undefined) {
            return;
        }
        if (index !== -1 && index < this.props.expression.length) {
            const tokenElem = document.getElementById('inputtoken-'+index);
            const tokenParentElemLeftPadding = parseFloat(window.getComputedStyle(tokenElem.parentElement).paddingLeft.replace('px',''));
            const widthOfCursor = parseFloat(getComputedStyle(tokenCursor).backgroundSize.split(' ')[0].replace('px',''));
            tokenCursor.style.left = (tokenElem.offsetLeft + (tokenElem.offsetWidth / 2) - tokenParentElemLeftPadding - (widthOfCursor/2)) + 'px';
            tokenCursor.style.opacity = 1;
        }else {
            tokenCursor.style.left = '0px';
            tokenCursor.style.opacity = 0;
        }
    }

    animateTokens = (prevSelectedInstr, currSelectedInstr) => {
        const playerScreen = document.getElementById('tokens').parentNode;

        if (prevSelectedInstr.stackTokens.length < currSelectedInstr.stackTokens.length) {
            const originLocation = document.getElementById('inputtoken-'+currSelectedInstr.selectedTokenIndex);
            const tokenToMove = originLocation.cloneNode(true);

            tokenToMove.style.position = 'absolute';
            tokenToMove.className += ' animatedToken';

            tokenToMove.style.top  = originLocation.parentNode.offsetTop + 'px';
            tokenToMove.style.left = (originLocation.offsetLeft + 
                                    document.getElementById('tokens').offsetLeft - 
                                    parseFloat(getComputedStyle(originLocation).marginLeft.replace('px',''))) + 'px';
            playerScreen.append(tokenToMove);

            const topIndex = currSelectedInstr.stackTokens.length - 1;
            const topStackToken = document.getElementById('stacktoken-'+topIndex);
            const tokenAnimationDuration = parseFloat(getComputedStyle(tokenToMove).transitionDuration.replace('s',''));
            
            topStackToken.style.opacity = 0;
            tokenToMove.style.top = topStackToken.offsetTop + 'px';
            tokenToMove.style.left = (topStackToken.offsetLeft + 3) + 'px';
            
            setTimeout(() => {
                topStackToken.style.opacity = 1;
                tokenToMove.remove();
                console.log('delete temp token and reappear stack token');
            }, tokenAnimationDuration * 1000);
        } else if (prevSelectedInstr.stackTokens.length - 1 === currSelectedInstr.stackTokens.length &&
            prevSelectedInstr.outputTokens.length === currSelectedInstr.outputTokens.length - 1) {
                const originLocation = this.latestTopStack.node;
                const tokenToMove = originLocation.cloneNode(true);

                tokenToMove.style.position = 'absolute';
                tokenToMove.className += ' animatedToken';

                tokenToMove.style.top  = this.latestTopStack.top + 'px';
                tokenToMove.style.left = (this.latestTopStack.left + 3) + 'px';
                playerScreen.append(tokenToMove);

                const topOutputIndex = currSelectedInstr.outputTokens.length - 1;
                const topOutputToken = document.getElementById('outputtoken-'+topOutputIndex);
                const tokenAnimationDuration = parseFloat(getComputedStyle(tokenToMove).transitionDuration.replace('s',''));

                topOutputToken.style.opacity = 0;
                tokenToMove.style.top = topOutputToken.offsetTop + 'px';
                tokenToMove.style.left = (topOutputToken.offsetLeft + parseFloat(getComputedStyle(topOutputToken).marginLeft.replace('px',''))) + 'px';
                
                setTimeout(() => {
                    topOutputToken.style.opacity = 1;
                    tokenToMove.remove();
                    console.log('delete temp token and reappear stack token');
                }, tokenAnimationDuration * 1000);
        } else if (prevSelectedInstr.outputTokens.length < currSelectedInstr.outputTokens.length) {
            const originLocation = document.getElementById('inputtoken-'+currSelectedInstr.selectedTokenIndex);
            const tokenToMove = originLocation.cloneNode(true);

            tokenToMove.style.position = 'absolute';
            tokenToMove.className += ' animatedToken';

            tokenToMove.style.top  = originLocation.parentNode.offsetTop + 'px';
            tokenToMove.style.left = (originLocation.offsetLeft + 
                                    document.getElementById('tokens').offsetLeft - 
                                    parseFloat(getComputedStyle(originLocation).marginLeft.replace('px',''))) + 'px';
            playerScreen.append(tokenToMove);

            const topIndex = currSelectedInstr.outputTokens.length - 1;
            const topStackToken = document.getElementById('outputtoken-'+topIndex);
            const tokenAnimationDuration = parseFloat(getComputedStyle(tokenToMove).transitionDuration.replace('s',''));
            
            topStackToken.style.opacity = 0;
            tokenToMove.style.top = topStackToken.offsetTop + 'px';
            tokenToMove.style.left = topStackToken.offsetLeft + 'px';
            
            setTimeout(() => {
                topStackToken.style.opacity = 1;
                tokenToMove.remove();
                console.log('delete temp token and reappear stack token');
            }, tokenAnimationDuration * 1000);
        }
    }

    animateRemoveHelpMsg = () => {
        const helpWindow = document.getElementById('helpWindow');
        if (this.helpMsg === null) {
            helpWindow.style.opacity = 0;
        } else {
            helpWindow.style.opacity = 1;
        }
    };

    resetActiveStructureAnimation = () => {
        if (this.helpMsg === null){
            document.getElementById('tokens').classList.remove('activeStructure');
            document.getElementById('stack').classList.remove('activeStructure');
            document.getElementById('output').classList.remove('activeStructure');
            console.log('reset glowing structures');
        }
        console.log('attemp to remove: ', this.helpMsg);
    }

    render = () => {
        const { 
            selectedInstr, 
            expression, 
            instructionSequenceLimit, 
            selectedInstructionIndex,
            selectedNotation,
            toNotation
        } = this.props;

        //Expects all expressions in state to be demilimited by spaces
        const expressionTokens = expression.split(' ');
        const divInputTokens = expressionTokens.map((token, idx) => <div key={idx} id={"inputtoken-"+idx} className='inputtoken'>{token}</div>);
        const divStackTokens = selectedInstr.stackTokens.map((token, idx) => <div key={idx} id={"stacktoken-"+idx} className='stacktoken'>{token}</div>);
        const divOutputTokens = selectedInstr.outputTokens.map((token, idx) => <div key={idx} id={"outputtoken-"+idx} className='outputtoken'>{token}</div>);

        const helpMsgFn = lookupHelperMsgs(
            selectedInstr.index, getHelpMsgMappings(selectedNotation, toNotation), 
            selectedInstructionIndex === instructionSequenceLimit - 1);
        this.helpMsg = helpMsgFn;

        return (
            <div className='player'>
                <div className="row1">
                    <div id="mainStructure">
                        <div id='tokens' className='contentBox'>
                            {divInputTokens}
                            <div id='tokenCursor'></div>
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
                    <PrecendenceTable />
                </div>
                <div id='helpWindow'>
                    {helpMsgFn && helpMsgFn({
                        selectedToken: expressionTokens[selectedInstr.selectedTokenIndex],
                        seectedTokenIndex: selectedInstr.selectedTokenIndex, 
                        topOfStack: selectedInstr.stackTokens[selectedInstr.stackTokens.length - 1],
                        topOfStackIndex: selectedInstr.stackTokens.length - 1,
                    })}
                </div>
            </div>
        );
    };
}

const PrecendenceTable = () => {
    return (
        <table id='precTable'>
            <tbody>
                <tr>
                    <th>Token</th>
                    <th>Precedence</th>
                </tr>
                <tr>
                    <td style={{fontSize: '15px', fontWeight: 'normal'}}>Operand</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>-  +</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>×  /</td>
                    <td>2</td>
                </tr>
                <tr>
                    <td>^</td>
                    <td>3</td>
                </tr>
                <tr>
                    <td>(  )</td>
                    <td>4</td>
                </tr>
            </tbody>
        </table>
    );
};
