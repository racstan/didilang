"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpret = void 0;
function interpret(ast) {
    var output = [];
    var variables = {};
    for (var _i = 0, ast_1 = ast; _i < ast_1.length; _i++) {
        var statement = ast_1[_i];
        try {
            switch (statement.type) {
                case 'assignment':
                    if (!statement.variable || !statement.expression)
                        throw new Error('Invalid assignment statement');
                    variables[statement.variable] = interpretExpression(statement.expression, variables);
                    break;
                case 'output':
                    if (!statement.expression)
                        throw new Error('Invalid output statement');
                    output.push(interpretExpression(statement.expression, variables));
                    break;
                case 'conditional':
                    if (!statement.condition || !statement.trueBranch)
                        throw new Error('Invalid conditional statement');
                    if (interpretExpression(statement.condition, variables) !== 0) {
                        output.push.apply(output, interpret(statement.trueBranch));
                    }
                    else if (statement.falseBranch) {
                        output.push.apply(output, interpret(statement.falseBranch));
                    }
                    break;
                case 'block':
                    if (!statement.statements)
                        throw new Error('Invalid block statement');
                    for (var _a = 0, _b = statement.statements; _a < _b.length; _a++) {
                        var innerStatement = _b[_a];
                        switch (innerStatement.type) {
                            case 'assignment':
                                if (!innerStatement.variable || !innerStatement.expression)
                                    throw new Error('Invalid assignment statement');
                                variables[innerStatement.variable] = interpretExpression(innerStatement.expression, variables);
                                break;
                            case 'output':
                                if (!innerStatement.expression)
                                    throw new Error('Invalid output statement');
                                output.push(interpretExpression(innerStatement.expression, variables));
                                break;
                            case 'conditional':
                                if (!innerStatement.condition || !innerStatement.trueBranch)
                                    throw new Error('Invalid conditional statement');
                                if (interpretExpression(innerStatement.condition, variables) !== 0) {
                                    output.push.apply(output, interpret(innerStatement.trueBranch));
                                }
                                else if (innerStatement.falseBranch) {
                                    output.push.apply(output, interpret(innerStatement.falseBranch));
                                }
                                break;
                            default:
                                throw new Error("Unknown inner statement type: ".concat(innerStatement.type));
                        }
                    }
                    break;
                default:
                    throw new Error("Unknown statement type: ".concat(statement.type));
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
        switch (token.type) {
            case 'number':
                stack.push(Number(token.value));
                break;
            case 'variable':
            case 'identifier':
                if (variables[token.value] === undefined) {
                    throw new Error("Variable ".concat(token.value, " is not defined"));
                }
                stack.push(variables[token.value]);
                break;
            case 'string':
                stack.push(token.value);
                break;
            case 'arithmetic_operator':
            case 'operator':
                while (stack.length > 1 && precedence[stack[stack.length - 2]] >= precedence[token.value]) {
                    applyOperatorToStack(stack);
                }
                stack.push(token.value);
                break;
            default:
                throw new Error("Unknown token type: ".concat(token.type));
        }
    }
    while (stack.length > 1) {
        applyOperatorToStack(stack);
    }
    return stack[0];
}
function applyOperatorToStack(stack) {
    var operand2 = stack.pop();
    var operand1 = stack.pop();
    var operator = stack.pop();
    stack.push(applyOperator(operator, operand1, operand2));
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
