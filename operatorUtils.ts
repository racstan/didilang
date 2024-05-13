"use strict";

export function applyOperatorToStack(stack: any[]): void {
    const right = stack.pop();
    const operator = stack.pop();
    const left = stack.pop();
    if (typeof operator !== 'string' || !['+', '-', '*', '/', '%', '**', '>', '<', '==', '!=', '>=', '<=', '&&', '||'].includes(operator)) {
        throw new Error(`Operator ${operator} is not supported`);
    }
    stack.push(applyOperator(operator, left, right));
}

export function applyOperator(operator: string, operand1: any, operand2: any): any {
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
        case '%':
            return operand1 % operand2;
        case '**':
            return Math.pow(operand1, operand2);
        case '>':
            return operand1 > operand2;
        case '<':
            return operand1 < operand2;
        case '==':
            return operand1 == operand2;
        case '!=':
            return operand1 != operand2;
        case '>=':
            return operand1 >= operand2;
        case '<=':
            return operand1 <= operand2;
        case '&&':
            // Adjusted to directly return boolean values
            return !!operand1 && !!operand2;
        case '||':
            // Adjusted to directly return boolean values
            return !!operand1 || !!operand2;
        default:
            throw new Error(`Operator ${operator} is not supported`);
    }
}