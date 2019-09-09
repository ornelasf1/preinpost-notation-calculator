
import React from 'react';
import { shallow, mount } from 'enzyme';
import {ConversionPlayBar} from '../../player/ConversionPlayBar';

describe('ConversionPlayBar', () => {
    let wrapper;

    const mockConversionFn = jest.fn();
    const mockAlgorithmFn = jest.fn();
    const mockUpdateSelectedInstruction = jest.fn();
    const selectedNotation = 'infix';
    const toNotation = 'postfix';
    const instructionSequenceLimit = 10;

    beforeEach(() => {
        wrapper = shallow(<ConversionPlayBar 
            conversion={mockConversionFn} 
            algorithm={mockAlgorithmFn}
            updateSelectedInstruction={mockUpdateSelectedInstruction}
            selectedNotation={selectedNotation}
            toNotation={toNotation}
            instructionSequenceLimit={instructionSequenceLimit}/>);
    });

    it('should render without throwing errors', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should call updateSelectedInstruction on componentDidUpdate', () => {
        wrapper.setProps({ valid: true });
        
        expect(mockUpdateSelectedInstruction).toBeCalled();
    });
});