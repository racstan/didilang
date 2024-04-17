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
            case 'function':
                currentStatement = { type: 'function', name: '', params: [], body: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    ast.push(currentStatement);
                }
                currentField = 'name';
                break;
            case 'call':
                currentStatement = { type: 'call', name: '', args: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    ast.push(currentStatement);
                }
                currentField = 'name';
                break;
            case 'comment':
            case 'multiline_comment':
                // Ignore comments
                break;
            case 'variable':
                currentStatement = { type: 'assignment', variable: '', expression: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    ast.push(currentStatement);
                }
                currentField = 'variable';
                break;
            case 'delimiter':
                switch (token.value) {
                    case '(':
                    case '{':
                        if (currentField !== 'condition' && currentField !== 'params') {
                            throw new Error('Unexpected left parenthesis or brace');
                        }
                        currentField = currentField === 'condition' ? 'trueBranch' : 'falseBranch';
                        break;
                    case ')':
                    case '}':
                        if (currentField !== 'trueBranch' && currentField !== 'falseBranch' && currentField !== 'params') {
                            throw new Error('Unexpected right parenthesis or brace');
                        }
                        currentField = '';
                        break;
                    case ',':
                        if (currentField !== 'params') {
                            throw new Error('Unexpected comma');
                        }
                        break;
                    default:
                        throw new Error("Unexpected delimiter: ".concat(token.value));
                }
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
            case 'agar didi': // Handle 'agar didi' tokens
                currentStatement = { type: 'if', condition: [], trueBranch: [], falseBranch: [] };
                if (currentBlock) {
                    currentBlock.push(currentStatement);
                }
                else {
                    ast.push(currentStatement);
                }
                currentField = 'condition';
                break;
            case 'warna didi': // Handle 'warna didi' tokens
                if (currentStatement && currentStatement.type === 'if' && currentField === '') {
                    currentField = 'falseBranch';
                }
                else {
                    throw new Error('Unexpected warna didi token');
                }
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
                    else if (currentField === 'name') {
                        currentStatement.name = token.value;
                        currentField = 'params';
                    }
                    else if (Array.isArray(currentStatement[currentField])) {
                        currentStatement[currentField].push({ type: token.type, value: token.value });
                    }
                    else {
                        throw new Error("Cannot push to non-array field: ".concat(currentField));
                    }
                }
                break;
            case 'assignment_operator':
                if (currentField !== 'variable') {
                    throw new Error('Unexpected assignment operator');
                }
                currentField = 'expression';
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
