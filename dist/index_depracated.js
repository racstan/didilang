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
            // Remove the quotation marks from the start and end of the string
            token.value = token.value.slice(1, -1);
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
        else if (/==|<=|>=|!=/.test(token.value)) {
            token.type = 'comparison_operator';
        }
        else if (/\+|-|\*|\/|%/.test(token.value)) {
            token.type = 'arithmetic_operator';
        }
        else if (/=/.test(token.value)) {
            token.type = 'assignment_operator';
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
    let currentField = '';
    for (const token of tokens) {
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
function interpret(ast) {
    for (const statement of ast) {
        if (statement.type === 'assignment') {
            variables[statement.variable] = interpretExpression(statement.expression, variables);
        }
        else if (statement.type === 'output') {
            const expressionValue = interpretExpression(statement.expression, variables);
            if (expressionValue !== undefined) {
                console.log(expressionValue);
            }
            else {
                console.error('Could not evaluate expression:', statement.expression);
            }
        }
    }
    return;
}
function interpretExpression(expression, variables) {
    let stack = [];
    let output = [];
    let precedence = {
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
    for (const token of expression) {
        if (token.type === 'number') {
            output.push(Number(token.value));
        }
        else if (token.type === 'identifier') {
            if (variables[token.value] === undefined) {
                throw new Error(`Variable ${token.value} is not defined`);
            }
            output.push(variables[token.value]);
        }
        else if (token.type === 'string') {
            output.push(token.value.slice(1, -1));
        }
        else if (token.type === 'operator') {
            while (stack.length > 0 && precedence[stack[stack.length - 1]] >= precedence[token.value]) {
                output.push(stack.pop());
            }
            stack.push(token.value);
        }
    }
    while (stack.length > 0) {
        output.push(stack.pop());
    }
    let resultStack = [];
    for (const token of output) {
        if (typeof token === 'number') {
            resultStack.push(token);
        }
        else {
            let operand2 = resultStack.pop();
            let operand1 = resultStack.pop();
            switch (token) {
                case '+':
                    resultStack.push(operand1 + operand2);
                    break;
                case '-':
                    resultStack.push(operand1 - operand2);
                    break;
                case '*':
                    resultStack.push(operand1 * operand2);
                    break;
                case '/':
                    resultStack.push(operand1 / operand2);
                    break;
                case '%':
                    resultStack.push(operand1 % operand2);
                    break;
                case '**':
                    resultStack.push(Math.pow(operand1, operand2));
                    break;
                case '>':
                    resultStack.push(operand1 > operand2 ? 1 : 0);
                    break;
                case '<':
                    resultStack.push(operand1 < operand2 ? 1 : 0);
                    break;
                case '==':
                    resultStack.push(operand1 == operand2 ? 1 : 0);
                    break;
                case '!=':
                    resultStack.push(operand1 != operand2 ? 1 : 0);
                    break;
                case '>=':
                    resultStack.push(operand1 >= operand2 ? 1 : 0);
                    break;
                case '<=':
                    resultStack.push(operand1 <= operand2 ? 1 : 0);
                    break;
                case '&&':
                    resultStack.push((operand1 !== 0 && operand2 !== 0) ? 1 : 0);
                    break;
                case '||':
                    resultStack.push((operand1 !== 0 || operand2 !== 0) ? 1 : 0);
                    break;
                default:
                    throw new Error(`Operator ${token} is not supported`);
            }
        }
    }
    return resultStack[0];
}
