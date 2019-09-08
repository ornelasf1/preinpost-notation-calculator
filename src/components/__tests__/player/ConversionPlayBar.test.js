
import React from 'react';
import { shallow, mount } from 'enzyme';
import {ConversionPlayBar} from '../../player/ConversionPlayBar';

describe('ConversionPlayBar', () => {

    it('should render without throwing errors', () => {
        const wrapper = shallow(<ConversionPlayBar 
            updateSelectedInstruction={1}
            selectedNotation={'infix'}
            toNotation={'postfix'}
            instructionSequenceLimit={18}/>);
        expect(wrapper.find(ConversionPlayBar)).to.have.lengthOf(1);
    });
});