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
            currentField = 'variable';
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
            if (currentField === 'variable') {
                currentStatement.variable = token.value;
                currentField = '';
            }
            else {
                currentStatement[currentField].push({ type: 'variable', value: token.value });
            }
        }
        else if (token.type === 'number') {
            if (currentField === 'value') {
                currentStatement['value'] = token.value;
            }
            else if (currentField === 'expression') {
                currentStatement['expression'].push({ type: 'number', value: token.value });
            }
        }
        else if (token.type === 'arithmetic_operator') {
            currentStatement[currentField].push({ type: 'operator', value: token.value });
        }
        else if (token.type === 'string') {
            currentStatement[currentField].push({ type: 'string', value: token.value });
        }
        else if (token.type === 'assignment_operator') {
            currentField = 'value';
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
