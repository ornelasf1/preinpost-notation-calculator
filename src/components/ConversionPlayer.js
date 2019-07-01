
import React from 'react';
import {connect} from 'react-redux';
import './ConversionPlayer.css';

export class ConversionPlayer extends React.Component {

    render = () => {
        return (
            <div className='player'>
                <h1>Tokens: {this.props.selectedInstr.tokens}</h1>
                <h1>Selected token: {this.props.selectedInstr.selectedToken}</h1>
                <h1>Operators: {this.props.selectedInstr.operator_stack}</h1>
                <h1>Output: {this.props.selectedInstr.output_stack}</h1>
            </div>
        );
    };
}

// const mapStateToProps = (state) => ({
//     algorithm: state.algorithmInstructions,
// });

// export default connect(mapStateToProps)(ConversionPlayer);