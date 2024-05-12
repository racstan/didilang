"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyOperator = exports.applyOperatorToStack = void 0;
function applyOperatorToStack(stack) {
    var right = stack.pop();
    var operator = stack.pop();
    var left = stack.pop();
    if (typeof operator !== 'string' || !['+', '-', '*', '/', '%', '**', '>', '<', '==', '!=', '>=', '<=', '&&', '||'].includes(operator)) {
        throw new Error("Operator ".concat(operator, " is not supported"));
    }
    stack.push(applyOperator(operator, left, right));
}
exports.applyOperatorToStack = applyOperatorToStack;
function applyOperator(operator, operand1, operand2) {
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
            return operand1 > operand2 ? 1 : 0;
        case '<':
            return operand1 < operand2 ? 1 : 0;
        case '==':
            return operand1 == operand2 ? 1 : 0;
        case '!=':
            return operand1 != operand2 ? 1 : 0;
        case '>=':
            return operand1 >= operand2 ? 1 : 0;
        case '<=':
            return operand1 <= operand2 ? 1 : 0;
        case '&&':
            return (operand1 !== 0 && operand2 !== 0) ? 1 : 0;
        case '||':
            return (operand1 !== 0 || operand2 !== 0) ? 1 : 0;
        default:
            throw new Error("Operator ".concat(operator, " is not supported"));
    }
}
exports.applyOperator = applyOperator;
