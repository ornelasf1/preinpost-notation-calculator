
import React from 'react';
import { shallow, mount } from 'enzyme';
import {ConversionPlayBar, Timer} from '../../player/ConversionPlayBar';

describe('ConversionPlayBar', () => {
    let wrapper;
    let instance;

    const mockConversionFn = {
        expressions: {
            infix: '',
            prefix: '',
            postfix: '',
        }
    };
    const mockAlgorithmFn = jest.fn();
    const mockUpdateSelectedInstruction = jest.fn();
    const mockSelectedNotation = 'infix';
    const mockToNotation = 'postfix';
    const mockInstructionSequenceLimit = 10;
    const mockInstructionIndex = 4;

    beforeEach(() => {
        wrapper = shallow(<ConversionPlayBar 
            conversion={mockConversionFn} 
            algorithm={mockAlgorithmFn}
            updateSelectedInstruction={mockUpdateSelectedInstruction}
            selectedNotation={mockSelectedNotation}
            toNotation={mockToNotation}
            instructionSequenceLimit={mockInstructionSequenceLimit}/>);

        instance = wrapper.instance();
    });

    it('should render without throwing errors', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should call updateSelectedInstruction on componentDidUpdate', () => {
        wrapper.setProps({ valid: true });
        expect(mockUpdateSelectedInstruction).toBeCalled();
    });

    it('should update instruction index if it\'s below the instruction sequence limit', () => {
        wrapper.setState({instructionIndex: 4});

        expect(mockUpdateSelectedInstruction).toHaveBeenCalledWith(
            instance.state.instructionIndex, 
            mockInstructionSequenceLimit);
        });
        
    it('should update instruction index to 0 if it\'s equal or greater than the sequence limit', () => {
        wrapper.setState({instructionIndex: 10});

        expect(mockUpdateSelectedInstruction).toHaveBeenCalledWith(
            0, 
            mockInstructionSequenceLimit);
    });

    it('should reset player if expression was changed', () => {
        instance.resetPlayer = jest.fn();
        
        wrapper.setProps({conversion: {expressions: {
            [mockSelectedNotation]: '4+3'
        }}});
        
        expect(instance.resetPlayer).toHaveBeenCalled();
    });



    
    it('should reset player if the expression is invalid and the player is active', () => {
        instance.resetPlayer = jest.fn();
        instance.playSeq = new Timer(
            jest.fn(), mockInstructionSequenceLimit, mockInstructionIndex
            );
            wrapper.setProps({ valid: false });
            
            expect(instance.resetPlayer).toHaveBeenCalled();
        });
        
    it("should set playSeq to undefined if it's not already when resetPlayer is called", () => {
        instance.playSeq = new Timer(
            jest.fn(), mockInstructionSequenceLimit, mockInstructionIndex
        );
        instance.setState = jest.fn();
        instance.resetPlayer();

        const resetSeq = instance.setState.mock.calls[0][1];
        resetSeq();

        expect(instance.playSeq).toBe(undefined);
    });

    it("should set playSeqEnded to true if instruction sequence has reached its limit when resetPlayer is called", () => {
        wrapper.setState({instructionIndex: mockInstructionSequenceLimit - 1});
        instance.setState = jest.fn();
        instance.resetPlayer();

        const resetSeq = instance.setState.mock.calls[0][1];
        resetSeq();

        expect(instance.playSeqEnded).toBe(true);
    });

    it("should set playSeqEnded to false if instruction sequence has not reached its limit when resetPlayer is called", () => {
        wrapper.setState({instructionIndex: mockInstructionIndex});
        instance.setState = jest.fn();
        instance.resetPlayer();

        const resetSeq = instance.setState.mock.calls[0][1];
        resetSeq();

        expect(instance.playSeqEnded).toBe(false);
    });

    it("should reset all values to false and -1 when reset player is called with playEnded false", () => {
        instance.resetPlayer();
        
        expect(instance.state.isPlaying).toBe(false);
        expect(instance.state.instructionIndex).toBe(-1);
        expect(instance.state.disableRewind).toBe(false);
        expect(instance.state.disableForward).toBe(false);
    });

    it("should set instruction index to last index in sequence and disable forward on first resetPlayer(true) call, then reset instruction index to -1 and disable rewind on second resetPlayer(true) call", () => {
        instance.resetPlayer(true);
        
        expect(instance.state.isPlaying).toBe(false);
        expect(instance.state.instructionIndex).toBe(mockInstructionSequenceLimit - 1);
        expect(instance.state.disableRewind).toBe(false);
        expect(instance.state.disableForward).toBe(true);

        instance.resetPlayer(true);
        
        expect(instance.state.isPlaying).toBe(false);
        expect(instance.state.instructionIndex).toBe(-1);
        expect(instance.state.disableRewind).toBe(true);
        expect(instance.state.disableForward).toBe(false);
    });



    it("should toggle isPlaying when play button is pressed", () => {
        const isPlaying = instance.state.isPlaying;
        instance.handlePlayBtn();
        
        expect(instance.state.isPlaying).toBe(!isPlaying);
    });
    
    it("should disable rewind when instruction index is -1", () => {
        instance.setState({instructionIndex: -1});
        instance.handlePlayBtn();

        expect(instance.state.disableRewind).toBe(true);
    });

    it("should toggle isPlaying when play button is pressed", () => {
        const isPlaying = instance.state.isPlaying;
        instance.handlePlayBtn();

        expect(instance.state.isPlaying).toBe(!isPlaying);
    });

    it("should toggle resume/pause function of player when playSeq is not undefined", () => {
        instance.playSeq = new Timer(
            jest.fn(), mockInstructionSequenceLimit, mockInstructionIndex
        );
        instance.playSeq.pause = jest.fn();
        instance.playSeq.resume = jest.fn();
        instance.resetPlayer = jest.fn();
        instance.setState({isPlaying: true});

        instance.handlePlayBtn();
        expect(instance.playSeq.resume).toBeCalled();

        instance.handlePlayBtn();
        expect(instance.playSeq.pause).toBeCalled();
    });

    it("should ");
});