"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
function parse(tokens) {
    if (tokens.length === 0) {
        throw new Error('No tokens to parse');
    }
    var ast = [];
    var currentBlock;
    var currentStatement;
    var currentField = '';
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        switch (token.type) {
            case 'start':
                currentBlock = [];
                break;
            case 'end':
                if (currentBlock) {
                    ast.push({ type: 'block', statements: currentBlock });
                    currentBlock = undefined;
                }
                else {
                    throw new Error('Unexpected end token');
                }
                break;
            case 'variable':
                currentStatement = { type: 'assignment', variable: '', expression: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    throw new Error('Variable statement not within a block');
                }
                currentField = 'variable';
                break;
            case 'print':
                currentStatement = { type: 'output', expression: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    throw new Error('Print statement not within a block');
                }
                currentField = 'expression';
                break;
            case 'conditional':
                currentStatement = { type: 'conditional', condition: [], trueBranch: [], falseBranch: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    throw new Error('Conditional statement not within a block');
                }
                currentField = 'condition';
                break;
            case 'identifier':
            case 'number':
            case 'arithmetic_operator':
            case 'string':
                if (currentStatement && currentField) {
                    if (currentField === 'variable') {
                        currentStatement.variable = token.value;
                        currentField = 'expression';
                    }
                    else if (Array.isArray(currentStatement[currentField])) {
                        currentStatement[currentField].push({ type: token.type, value: token.value });
                    }
                    else {
                        throw new Error("Cannot push to non-array field: ".concat(currentField));
                    }
                }
                break;
            case 'boolean':
                if (currentStatement && currentField && (token.value === 'sahi' || token.value === 'galat')) {
                    var booleanValue = token.value === 'sahi' ? true : false;
                    if (Array.isArray(currentStatement[currentField])) {
                        currentStatement[currentField].push({ type: 'boolean', value: booleanValue });
                    }
                    else {
                        throw new Error("Cannot push to non-array field: ".concat(currentField, " for boolean values"));
                    }
                }
                break;
            case 'assignment_operator':
                if (currentField !== 'variable') {
                    throw new Error('Unexpected assignment operator');
                }
                currentField = 'expression';
                break;
            case 'leftParen':
            case 'leftBrace':
                if (currentField !== 'condition') {
                    throw new Error('Unexpected left parenthesis or brace');
                }
                currentField = currentField === 'condition' ? 'trueBranch' : 'falseBranch';
                break;
            case 'rightParen':
            case 'rightBrace':
                if (currentField !== 'trueBranch' && currentField !== 'falseBranch') {
                    throw new Error('Unexpected right parenthesis or brace');
                }
                currentField = '';
                break;
            default:
                throw new Error("Unknown token type: ".concat(token.type));
        }
    }
    if (currentBlock) {
        throw new Error('Unclosed block');
    }
    return ast;
}
exports.parse = parse;
