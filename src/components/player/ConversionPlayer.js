
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
        this.updateTokenCursor(this.props.selectedInstr.selectedTokenIndex);
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
        if (index === -1) {
            tokenCursor.style.display = 'none';
            document.getElementById('tokens').appendChild(tokenCursor);
            return;
        }else {
            tokenCursor.style.display = 'block';
        }
        document.getElementById('token-'+index).appendChild(tokenCursor);
    }

    updateTokenCursorLocations = () => {
        const cursorLocations = [];
        for (var idx = 0; idx < this.props.expression.length; idx++){
            const divToken = document.getElementById('token-'+idx);
            const nextCursorCoords = this.getCoords(divToken);
            cursorLocations.push({
                left: nextCursorCoords.left + 'px',
                top: (nextCursorCoords.top + nextCursorCoords.height) + 'px',
            });
        };
        this.setState({tokenCursorLocations: cursorLocations});
    };

    render = () => {
        const expressionTokens = this.props.expression.split('');
        const divInputTokens = expressionTokens.map((token, idx) => <div key={idx} id={"token-"+idx} className='token'>{token}</div>);
        const divStackTokens = this.props.selectedInstr.stackTokens.map((token, idx) => <div key={idx}>{token}</div>);
        const divOutputTokens = this.props.selectedInstr.outputTokens.map((token, idx) => <div key={idx}>{token}</div>);

        return (
            <div className='player'>
                <div id='tokens'>
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
