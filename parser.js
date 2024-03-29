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
                currentStatement = { type: 'assignment', variable: '', value: '', expression: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    ast.push(currentStatement);
                }
                currentField = 'variable';
                break;
            case 'print':
                currentStatement = { type: 'output', expression: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    ast.push(currentStatement);
                }
                currentField = 'expression';
                break;
            case 'conditional':
                currentStatement = { type: 'conditional', condition: [], trueBranch: [], falseBranch: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    ast.push(currentStatement);
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
                        currentField = 'value';
                    }
                    else {
                        currentStatement[currentField].push({ type: token.type, value: token.value });
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
