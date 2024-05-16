"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpret = void 0;
var operatorUtils_1 = require("./operatorUtils");
function interpret(ast, variables) {
    if (variables === void 0) { variables = {}; }
    var output = [];
    for (var _i = 0, ast_1 = ast; _i < ast_1.length; _i++) {
        var statement = ast_1[_i];
        try {
            switch (statement.type) {
                case 'assignment':
                    if (!statement.variable || statement.expression === undefined)
                        throw new Error('Invalid assignment statement');
                    variables[statement.variable] = interpretExpression(statement.expression, variables);
                    break;
                case 'output':
                    if (statement.expression === undefined)
                        throw new Error('Invalid output statement');
                    output.push(interpretExpression(statement.expression, variables));
                    break;
                case 'conditional':
                    if (!statement.condition || !statement.trueBranch)
                        throw new Error('Invalid conditional statement');
                    if (interpretExpression(statement.condition, variables)) {
                        output = output.concat(interpret(statement.trueBranch, variables));
                    }
                    else if (statement.falseBranch) {
                        output = output.concat(interpret(statement.falseBranch, variables));
                    }
                    break;
                case 'block':
                    if (!statement.statements)
                        throw new Error('Invalid block statement');
                    output = output.concat(interpret(statement.statements, variables));
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
    if (!Array.isArray(expression)) {
        expression = [expression];
    }
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
                    throw new Error("Variable ".concat(token.value, " is not defined. Please declare and initialize the variable before use."));
                }
                stack.push(variables[token.value]);
                break;
            case 'string':
                stack.push(token.value);
                break;
            case 'boolean':
                stack.push(token.value === 'true');
                break;
            case 'arithmetic_operator':
            case 'operator':
                while (stack.length > 1 && precedence[stack[stack.length - 2]] >= precedence[token.value]) {
                    (0, operatorUtils_1.applyOperatorToStack)(stack);
                }
                stack.push(token.value);
                break;
            default:
                throw new Error("Unknown token type: ".concat(token.type));
        }
    }
    while (stack.length > 1) {
        (0, operatorUtils_1.applyOperatorToStack)(stack);
    }
    return stack[0];
}
