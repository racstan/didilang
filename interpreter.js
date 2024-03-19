"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpret = void 0;
function interpret(ast) {
    var output = [];
    var variables = {};
    for (var _i = 0, ast_1 = ast; _i < ast_1.length; _i++) {
        var statement = ast_1[_i];
        try {
            if (statement.type === 'assignment') {
                if (statement.value !== '') {
                    variables[statement.variable] = Number(statement.value);
                }
                else if (statement.expression.length > 0) {
                    variables[statement.variable] = interpretExpression(statement.expression, variables);
                }
            }
            else if (statement.type === 'output') {
                var expressionValue = interpretExpression(statement.expression, variables);
                if (expressionValue !== undefined) {
                    output.push(expressionValue);
                }
                else {
                    console.error('Could not evaluate expression:', statement.expression);
                }
            }
        }
        catch (error) {
            console.error('Error interpreting statement:', statement, error);
        }
    }
    return output;
}
exports.interpret = interpret;
function interpretExpression(expression, variables) {
    var stack = [];
    var precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2,
        '**': 3,
        '>': 0,
        '<': 0,
        '==': 0,
        '!=': 0,
        '>=': 0,
        '<=': 0,
        '&&': -1,
        '||': -1
    };
    for (var _i = 0, expression_1 = expression; _i < expression_1.length; _i++) {
        var token = expression_1[_i];
        if (token.type === 'number') {
            stack.push(Number(token.value));
        }
        else if (token.type === 'identifier') {
            if (variables[token.value] === undefined) {
                throw new Error("Variable ".concat(token.value, " is not defined"));
            }
            stack.push(variables[token.value]);
        }
        else if (token.type === 'string') {
            stack.push(token.value);
        }
        else if (token.type === 'operator') {
            while (stack.length > 2 && precedence[typeof stack[stack.length - 2] === 'string' ? stack[stack.length - 2] : ''] >= precedence[token.value]) {
                var operator = stack.pop();
                var operand2 = stack.pop();
                var operand1 = stack.pop();
                stack.push(applyOperator(operator, operand1, operand2));
            }
            stack.push(token.value);
        }
    }
    while (stack.length > 2) {
        var operator = stack.pop();
        var operand2 = stack.pop();
        var operand1 = stack.pop();
        stack.push(applyOperator(operator, operand1, operand2));
    }
    return stack[0];
}
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
