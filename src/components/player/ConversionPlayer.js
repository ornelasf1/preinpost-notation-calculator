
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
            tokenCursorLocations: [],
            divStackTokens: [],
            divOutputTokens: [],
        };
    }

    componentDidMount = () => {
        console.log('component did mount')
    }

    componentDidUpdate = prevProps => {
        if (prevProps.selectedInstr.selectedTokenIndex !==
            this.props.selectedInstr.selectedTokenIndex 
            || this.props.selectedInstr.selectedTokenIndex === -1) {
                this.updateTokenStyle(this.props.selectedInstr.selectedTokenIndex);
            }
        this.animateTokens(prevProps.selectedInstr, this.props.selectedInstr);
    }

    getCoords = elem => {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + window.pageYOffset,
            left: box.left + window.pageXOffset,
            height: box.height,
        };
    }

    updateTokenCursor = index => {
        const { tokenCursorLocations } = this.state;
        const tokenCursor = document.getElementById('tokenCursor');
        if (tokenCursor === undefined) {
            return;
        }
        console.log('Appending child to token-', index);
        if (index !== -1 && index < this.props.expression.length) {
            tokenCursor.style.display = 'block';
            document.getElementById('inputtoken-'+index).appendChild(tokenCursor);
        }else {
            tokenCursor.style.display = 'none';
            document.getElementById('tokens').appendChild(tokenCursor);
        }
    }

    updateTokenCursorLocations = () => {
        const cursorLocations = [];
        for (var idx = 0; idx < this.props.expression.length; idx++){
            const divToken = document.getElementById('inputtoken-'+idx);
            const nextCursorCoords = this.getCoords(divToken);
            cursorLocations.push({
                left: nextCursorCoords.left + 'px',
                top: (nextCursorCoords.top + nextCursorCoords.height) + 'px',
            });
        };
        this.setState({tokenCursorLocations: cursorLocations});
    };

    updateTokenStyle = index => {
        const tokenCursor = document.getElementById('tokenCursor');
        if (tokenCursor === undefined) {
            return;
        }
        if (index !== -1 && index < this.props.expression.length) {
            const tokenElem = document.getElementById('inputtoken-'+index);
            const tokenParentElemLeftPadding = parseFloat(window.getComputedStyle(tokenElem.parentElement).paddingLeft.replace('px',''));
            tokenCursor.style.left = (tokenElem.offsetLeft - tokenParentElemLeftPadding) + 'px';
            tokenCursor.style.width = tokenElem.offsetWidth + 'px';
            tokenCursor.style.opacity = 1;
        }else {
            tokenCursor.style.left = '0px';
            tokenCursor.style.opacity = 0;
        }
    }

    // Relative to #player
    moveNodeFromOriginToDestination = (item, origin, destination) => {
        // inputToken.style.top  = originLocation.parentNode.offsetTop + 'px';
        // inputToken.style.left = (originLocation.offsetLeft + document.getElementById('tokens').offsetLeft - parseFloat(getComputedStyle(inputToken).marginLeft.replace('px',''))) + 'px'

        // inputToken.style.left = stackToken.offsetLeft + 3 + 'px'
        // inputToken.style.top = stackToken.offsetTop + 'px'
    }

    animateTokens = (prevSelectedInstr, currSelectedInstr) => {
        if (prevSelectedInstr.stackTokens.length < currSelectedInstr.stackTokens.length) {
            const playerScreen = document.getElementById('tokens').parentNode;
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

        }
    }

    render = () => {
        const { selectedInstr, expression } = this.props;
        // const { divStackTokens, divOutputTokens } = this.state;

        //Expects all expressions in state to be demilimited by spaces
        const expressionTokens = expression.split(' ');
        const divInputTokens = expressionTokens.map((token, idx) => <div key={idx} id={"inputtoken-"+idx} className='inputtoken'>{token}</div>);
        const divStackTokens = selectedInstr.stackTokens.map((token, idx) => <div key={idx} id={"stacktoken-"+idx} className='stacktoken'>{token}</div>);
        const divOutputTokens = selectedInstr.outputTokens.map((token, idx) => <div key={idx} id={"outputtoken-"+idx} className='outputtoken'>{token}</div>);

        return (
            <div className='player'>
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
        );
    };
}
