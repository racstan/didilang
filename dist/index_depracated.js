"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let code = '';
let variables = {};
const didiDict = {
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
    // Error message
    "Kya kar rhi hai tu": "Invalid syntax"
};
console.log('Please enter your code: ');
let isInputComplete = false;
rl.on('line', (input) => {
    code += input + '\n';
    if (input.trim() === 'bye didi') {
        isInputComplete = true;
        rl.close();
    }
});
rl.on('close', () => {
    if (isInputComplete) {
        try {
            const tokens = tokenize(code);
            let ast = parse(tokens);
            interpret(ast);
        }
        catch (error) {
            console.error(error.message);
        }
    }
    else {
        console.error('Input was not complete. Please make sure to end your code with "bye didi".');
    }
    setTimeout(() => process.exit(), 5000);
});
function tokenize(code) {
    if (!didiDict) {
        throw new Error('didiDict is not defined');
    }
    code = code.trim();
    if (!code.startsWith('hi didi') || !code.endsWith('bye didi')) {
        throw new Error('Code must start with "hi didi" and end with "bye didi".');
    }
    const tokens = [];
    const regex = /(?<=^|\s)(hi didi|bye didi|jab tak didi|agar didi|warna didi|bol didi|didi ye hai|nalla|sahi|galat)(?=\s|$)|"((?:\\.|[^"\\])*)"|[a-zA-Z_]\w*|\d+|==|<=|>=|!=|\+|-|\*|\/|%|\(|\)|\{|\}|,|\/\/.*/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
        const token = {
            type: 'unknown',
            value: match[0].trim(),
        };
        if (didiDict[token.value]) {
            token.type = didiDict[token.value];
        }
        else if (/^".*"$/.test(token.value)) {
            token.type = 'string';
            token.value = JSON.parse(token.value); // unescape the escaped characters
        }
        else if (/[a-zA-Z_]\w*/.test(token.value)) {
            token.type = 'identifier';
        }
        else if (/\d+/.test(token.value)) {
            token.type = 'number';
        }
        else if (/\/\/.*/.test(token.value)) {
            token.type = 'comment';
        }
        else if (/==|<=|>=|!=|\+|-|\*|\/|%/.test(token.value)) {
            token.type = 'operator';
        }
        else if (/\(|\)|\{|\}|,/.test(token.value)) { // removed semicolon from the regex
            token.type = 'delimiter';
        }
        tokens.push(token);
    }
    return tokens;
}
function parse(tokens) {
    const ast = [];
    let currentStatement = {};
    for (const token of tokens) {
        if (token.type === 'variable') {
            currentStatement = { type: 'assignment', variable: '', value: '', expression: [] };
            ast.push(currentStatement);
        }
        else if (token.type === 'print') {
            currentStatement = { type: 'output', expression: [] };
            ast.push(currentStatement);
        }
        else if (token.type === 'identifier') {
            if (currentStatement.type === 'assignment' && !currentStatement.variable) {
                currentStatement.variable = token.value;
            }
            else {
                currentStatement.expression.push(token);
            }
        }
        else if (token.type === 'number' || token.type === 'operator') {
            if (currentStatement.type === 'assignment' && !currentStatement.value) {
                currentStatement.value = Number(token.value);
            }
            else {
                currentStatement.expression.push(token);
            }
        }
    }
    return ast;
}
function interpret(ast) {
    for (const statement of ast) {
        if (statement.type === 'assignment') {
            variables[statement.variable] = interpretExpression(statement.expression, variables);
        }
        else if (statement.type === 'output') {
            const expressionValue = interpretExpression(statement.expression, variables);
            console.log(expressionValue);
        }
    }
    return;
}
function interpretExpression(expression, variables) {
    let operands = [];
    let operators = [];
    for (const token of expression) {
        if (token.type === 'number') {
            operands.push(Number(token.value));
        }
        else if (token.type === 'identifier') {
            if (variables[token.value] === undefined) {
                throw new Error(`Variable ${token.value} is not defined`);
            }
            operands.push(variables[token.value]);
        }
        else if (token.type === 'string') {
            operands.push(token.value);
        }
        else if (token.type === 'operator') {
            operators.push(token.value);
        }
    }
    let result = operands[0];
    for (let i = 0; i < operators.length; i++) {
        switch (operators[i]) {
            case '+':
                if (typeof result === 'number' && typeof operands[i + 1] === 'number') {
                    result = result + operands[i + 1];
                }
                else if (typeof result === 'string' || typeof operands[i + 1] === 'string') {
                    result = String(result) + String(operands[i + 1]);
                }
                break;
            case '-':
                if (typeof result === 'number' && typeof operands[i + 1] === 'number') {
                    result = result - operands[i + 1];
                }
                break;
            case '*':
                if (typeof result === 'number' && typeof operands[i + 1] === 'number') {
                    result = result * operands[i + 1];
                }
                break;
            case '/':
                if (typeof result === 'number' && typeof operands[i + 1] === 'number') {
                    result = result / operands[i + 1];
                }
                break;
            case '%':
                if (typeof result === 'number' && typeof operands[i + 1] === 'number') {
                    result = result % operands[i + 1];
                }
                break;
            case '**':
                if (typeof result === 'number' && typeof operands[i + 1] === 'number') {
                    result = Math.pow(result, operands[i + 1]);
                }
                break;
            // handle other operators...
        }
    }
    return result;
}
