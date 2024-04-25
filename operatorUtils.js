"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyOperator = exports.applyOperatorToStack = void 0;
var interpreterMain_1 = require("./interpreterMain");
function applyOperatorToStack(stack, functions, variables) {
    var right = stack.pop();
    var operator = stack.pop();
    var left = stack.pop();
    if (!['+', '-', '*', '/', '%', '**', '>', '<', '==', '!=', '>=', '<=', '&&', '||'].includes(operator)) {
        throw new Error("Operator ".concat(operator, " is not supported"));
    }
    else if (operator in functions) {
        var func = functions[operator];
        if (!func)
            throw new Error("Function ".concat(operator, " is not defined"));
        if (func.params.length !== 2)
            throw new Error("Function ".concat(operator, " expects 2 arguments but got ").concat(func.params.length));
        var oldVariables = __assign({}, variables);
        variables[func.params[0]] = left;
        variables[func.params[1]] = right;
        var result = (0, interpreterMain_1.interpret)(func.body);
        variables = oldVariables;
        stack.push(result);
    }
    else {
        stack.push(applyOperator(operator, left, right));
    }
}
exports.applyOperatorToStack = applyOperatorToStack;
function applyOperator(operator, operand1, operand2) {
    if (typeof operand1 !== 'number' || typeof operand2 !== 'number') {
        throw new Error("Operands must be numbers");
    }
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
