"use strict";

interface Token {
    type: string;
    value: string;
}

const variables: { [key: string]: any } = {};

const didiDict: { [key: string]: string } = {
    // Keywords
    "hi didi": "start",
    "bye didi": "end",
    "didi ye hai": "variable",
    "bol didi": "print",
    "agar didi": "if",
    "warna didi": "else",
    "jab tak didi": "while",
    "bas kar didi": "break",
    "agla dekh didi": "continue",
    // Data types
    "nalla": "null",
    "sahi": "true",
    "galat": "false",
    "array": "array",
    "object": "object",
    // Error message
    "Kya kar rhi hai tu": "Invalid syntax"
};

export function tokenize(code: string): Token[] {
    if (!didiDict) {
        throw new Error('didiDict is not defined');
    }
    code = code.trim();
    if (!code.startsWith('hi didi') || !code.endsWith('bye didi')) {
        throw new Error('Code must start with "hi didi" and end with "bye didi".');
    }
    const tokens: Token[] = [];
    const regex = /(hi didi|bye didi|jab tak didi|agar didi|warna didi|bol didi|didi ye hai|nalla|sahi|galat|array|object)|"((?:\\.|[^"\\])*)"|[a-zA-Z_]\w*|\d+(\.\d+)?|==|<=|>=|!=|\+|-|\*|\/|%|\(|\)|\{|\}|,|\/\/.*|\/\*[\s\S]*?\*\//g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(code)) !== null) {
        const token: Token = {
            type: 'unknown',
            value: match[0],
        };
        if (didiDict[token.value]) {
            token.type = didiDict[token.value];
            if (token.value === "sahi" || token.value === "galat") {
                token.type = 'boolean';
                token.value = didiDict[token.value]; // Map to "true" or "false"
            }
        } else if (/^".*"$/.test(token.value)) {
            token.type = 'string';
            token.value = token.value.slice(1, -1);
        } else if (/[a-zA-Z_]\w*/.test(token.value)) {
            if (variables[token.value]) {
                token.type = 'variable';
            } else {
                token.type = 'identifier';
            }
        } else if (/\d+(\.\d+)?/.test(token.value)) {
            token.type = 'number';
        } else if (/\/\/.*/.test(token.value)) {
            token.type = 'comment';
        } else if (/\/\*[\s\S]*?\*\//.test(token.value)) {
            token.type = 'multiline_comment';
        } else if (/==|<=|>=|!=/.test(token.value)) {
            token.type = 'comparison_operator';
        } else if (/\+|-|\*|\/|%/.test(token.value)) {
            token.type = 'arithmetic_operator';
        } else if (/=/.test(token.value)) {
            token.type = 'assignment_operator';
        } else if (/\(|\)|\{|\}|,/.test(token.value)) {
            token.type = 'delimiter';
        } else if (/[\r\n]+/.test(token.value)) {
            token.type = 'newline';
        } else if (/\s+/.test(token.value)) {
            token.type = 'whitespace';
        }
        if (token.type === 'unknown') {
            throw new Error(`Unknown token: ${token.value}`);
        }
        tokens.push(token);
    }
    return tokens;
}