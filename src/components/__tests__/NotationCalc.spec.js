import { infixToPostfix, postfixToInfix } from '../NotationCalc';

const expressions = [
    'A+B', 'A-B', 'A*B', 'A/B', 'A^B', 'A +B', 'A -B', 'A *B', 'A /B', 'A ^B', 'A+ B', 'A- B', 'A* B', 'A/ B', 'A^ B',
    'A + B', 'A - B', 'A * B', 'A / B', 'A ^ B', 'A+ B+ C', 'A-B* C', 'A*B /C', 'A/ B^ C', 'A^B^C',
    'A+ (B+(C+(D+E)))', 'A+ (B+ (C+ (D+ E)))', 'A/ (B-(C+(D^E)))', '(A+B) / (B -C)/(D*E )', 'A+ (B+(C+(D+E)) ) / ((A+B) / (B -C)/(D*E ))'
];

describe('NotationConv', () => {
    it('should convert INFIX expressions to POSTFIX and vice-versa correctly', () => {
        
    });
});