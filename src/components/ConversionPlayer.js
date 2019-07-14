
import React from 'react';
import _ from 'underscore';
import {connect} from 'react-redux';
import './ConversionPlayer.css';

export class ConversionPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tokens: [],
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
        if (prevProps.selectedInstr.tokens !== this.props.selectedInstr.tokens
            && this.state.tokens.length === 0) {
                this.setState({tokens: this.props.selectedInstr.tokens.reverse()});
        }
        else if (!_.isEmpty(prevProps.selectedInstr) && !_.isEmpty(this.props.selectedInstr) && 
                prevProps.selectedInstr.tokens.length !== this.props.selectedInstr.tokens.length) {
            this.setState({selectedTokenIndex: this.state.selectedTokenIndex+=1}, () => {console.log("Updated: ", this.state); this.updateTokenCursor(this.state.selectedTokenIndex);});
        } else if (Object.keys(this.props.selectedInstr) !== 0 && this.props.selectedInstr.index === -1 
                && this.state.selectedTokenIndex !== -1) {
            this.setState({selectedTokenIndex: -1}, () => this.updateTokenCursor(this.state.selectedTokenIndex));
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
        const divTokens = this.state.tokens.map((token, idx) => <div key={idx} id={"token-"+idx}>{token}</div>);


        return (
            <div className='player'>
                <div id='tokenCursor'></div>
                <div id='tokens'>
                    {divTokens}
                </div>
            </div>
        );
    };
}

// const mapStateToProps = (state) => ({
//     algorithm: state.algorithmInstructions,
// });

// export default connect(mapStateToProps)(ConversionPlayer);