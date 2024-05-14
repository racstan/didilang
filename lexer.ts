"use strict";

interface Token {
    type: string;
    value: string | boolean;
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
        let tokenValue: string | boolean = match[0];
        let tokenType: string = 'unknown';

        if (didiDict[tokenValue]) {
            tokenType = didiDict[tokenValue];
            if (tokenValue === "sahi" || tokenValue === "galat") {
                tokenType = 'boolean';
                tokenValue = tokenValue === "sahi"; // Simplified to directly assign true or false
            }
        } else if (/^".*"$/.test(tokenValue)) {
            tokenType = 'string';
            tokenValue = tokenValue.slice(1, -1);
        } else if (/[a-zA-Z_]\w*/.test(tokenValue)) {
            if (variables[tokenValue]) {
                tokenType = 'variable';
            } else {
                tokenType = 'identifier';
            }
        } else if (/\d+(\.\d+)?/.test(tokenValue)) {
            tokenType = 'number';
        } else if (/\/\/.*/.test(tokenValue)) {
            tokenType = 'comment';
        } else if (/\/\*[\s\S]*?\*\//.test(tokenValue)) {
            tokenType = 'multiline_comment';
        } else if (/==|<=|>=|!=/.test(tokenValue)) {
            tokenType = 'comparison_operator';
        } else if (/\+|-|\*|\/|%/.test(tokenValue)) {
            tokenType = 'arithmetic_operator';
        } else if (/=/.test(tokenValue)) {
            tokenType = 'assignment_operator';
        } else if (/\(|\)|\{|\}|,/.test(tokenValue)) {
            tokenType = 'delimiter';
        } else if (/[\r\n]+/.test(tokenValue)) {
            tokenType = 'newline';
        } else if (/\s+/.test(tokenValue)) {
            tokenType = 'whitespace';
        }
        if (tokenType === 'unknown') {
            throw new Error(`Unknown token: ${tokenValue}`);
        }
        tokens.push({ type: tokenType, value: tokenValue });
    }
    return tokens;
}