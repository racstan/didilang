"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = void 0;
var variables = {};
var didiDict = {
    // Keywords
    "hi didi": "start",
    "bye didi": "end",
    "didi ye hai": "variable",
    "bol didi": "print",
    "agar didi": "if",
    "warna didi": "else",
    "warna agar didi": "else if",
    "jab tak didi": "while",
    "bas kar didi": "break",
    "agla dekh didi": "continue",
    "didi ye function": "function", // Added function keyword
    // Data types
    "nalla": "null",
    "sahi": "true",
    "galat": "false",
    "array": "array",
    "object": "object",
    // Error message
    "Kya kar rhi hai tu": "Invalid syntax"
};
function tokenize(code) {
    if (!didiDict) {
        throw new Error('didiDict is not defined');
    }
    code = code.trim();
    if (!code.startsWith('hi didi') || !code.endsWith('bye didi')) {
        throw new Error('Code must start with "hi didi" and end with "bye didi".');
    }
    var tokens = [];
    var regex = /(hi didi|bye didi|jab tak didi|agar didi|warna didi|warna agar didi|bol didi|didi ye hai|didi ye function|nalla|sahi|galat|array|object)|"((?:\\.|[^"\\])*)"|[a-zA-Z_]\w*|\d+(\.\d+)?|==|<=|>=|!=|\/\/.*|\/\*[\s\S]*?\*\/|\+|-|\*|\/|%|\(|\)|\{|\}|,/g;
    var match;
    while ((match = regex.exec(code)) !== null) {
        var token = {
            type: 'unknown',
            value: match[0],
        };
        if (didiDict[token.value]) {
            token.type = didiDict[token.value];
        }
        else if (/^".*"$/.test(token.value)) {
            token.type = 'string';
            token.value = token.value.slice(1, -1);
        }
        else if (/^\/\/.*/.test(token.value)) {
            token.type = 'comment';
            token.value = token.value.slice(2).trim();
        }
        else if (/^\/\*[\s\S]*?\*\/$/.test(token.value)) {
            token.type = 'multiline_comment';
            token.value = token.value.slice(2, -2).trim();
        }
        else if (/[a-zA-Z_]\w*/.test(token.value)) {
            if (variables[token.value]) {
                token.type = 'variable';
            }
            else {
                token.type = 'identifier';
            }
        }
        else if (/\d+(\.\d+)?/.test(token.value)) {
            token.type = 'number';
        }
        else if (/==|<=|>=|!=/.test(token.value)) {
            token.type = 'comparison_operator';
        }
        else if (/\+|-|\*|\/|%/.test(token.value)) {
            token.type = 'arithmetic_operator';
        }
        else if (/=/.test(token.value)) {
            token.type = 'assignment_operator';
        }
        else if (/\(|\)|\{|\}|,/.test(token.value)) {
            token.type = 'delimiter';
        }
        else if (/[\r\n]+/.test(token.value)) {
            token.type = 'newline';
        }
        else if (/\s+/.test(token.value)) {
            token.type = 'whitespace';
        }
        if (token.type === 'unknown') {
            throw new Error("Unknown token: ".concat(token.value));
        }
        tokens.push(token);
    }
    return tokens;
}
exports.tokenize = tokenize;
