
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

    render = () => {
        //Expects all expressions in state to be demilimited by spaces
        const divInputTokens = expressionTokens.map((token, idx) => <div key={idx} id={"inputtoken-"+idx} className='inputtoken'>{token}</div>);

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
