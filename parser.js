"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
function parse(tokens) {
    var ast = [];
    var currentStatement = {};
    var currentField = '';
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (token.type === 'variable') {
            currentStatement = { type: 'assignment', variable: '', value: '', expression: [] };
            ast.push(currentStatement);
            currentField = 'expression';
        }
        else if (token.type === 'print') {
            currentStatement = { type: 'output', expression: [] };
            ast.push(currentStatement);
            currentField = 'expression';
        }
        else if (token.type === 'conditional') {
            currentStatement = { type: 'conditional', condition: [], trueBranch: [], falseBranch: [] };
            ast.push(currentStatement);
            currentField = 'condition';
        }
        else if (token.type === 'identifier') {
            if (currentStatement.type === 'assignment' && !currentStatement.variable) {
                currentStatement.variable = token.value;
            }
            else {
                currentStatement[currentField].push(token);
            }
        }
        else if (token.type === 'number' || token.type === 'operator' || token.type === 'string') {
            currentStatement[currentField].push(token);
        }
        else if (token.type === 'leftParen' || token.type === 'leftBrace') {
            currentField = currentField === 'condition' ? 'trueBranch' : 'falseBranch';
        }
        else if (token.type === 'rightParen' || token.type === 'rightBrace') {
            currentField = '';
        }
    }
    return ast;
}
exports.parse = parse;
