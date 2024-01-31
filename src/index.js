function tokenize(code) {
    if (!code.startsWith('hi didi') || !code.endsWith('bye didi')) {
        console.log('Error: Code must start with "hi didi" and end with "bye didi".');
        return;
    }
    var tokens = [];
    var regex = /\b(jab tak|agar|warna|bol|didi ye hai|nalla|sahi|galat)\b|[a-zA-Z_]\w*|\d+|==|<=|>=|!=|\+|-|\*|\/|%|\(|\)|\{|\}|;|,|\s+/g;
    var match;
    while ((match = regex.exec(code)) !== null) {
        var token = {
            type: 'unknown',
            value: match[0].trim(),
        };
        if (/\b(jab tak|agar|warna|bol|didi ye hai|nalla|sahi|galat)\b/.test(token.value)) {
            token.type = 'keyword';
        }
        else if (/[a-zA-Z_]\w*/.test(token.value)) {
            token.type = 'identifier';
        }
        else if (/\d+/.test(token.value)) {
            token.type = 'number';
        }
        else if (/==|<=|>=|!=|\+|-|\*|\/|%/.test(token.value)) {
            token.type = 'operator';
        }
        else if (/\(|\)|\{|\}|;|,/.test(token.value)) {
            token.type = 'delimiter';
        }
        tokens.push(token);
    }
    return tokens;
}
//parser
function parse(tokens) {
    var ast = [];
    var currentStatement = {};
    var currentBlock = [];
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (token.type === 'keyword') {
            if (token.value === 'didi ye hai') {
                currentStatement = { type: 'variableDeclaration', name: '', value: '', dataType: '' };
            }
            else if (token.value === 'bol') {
                currentStatement = { type: 'output', expression: '' };
            }
            else if (token.value === 'agar') {
                currentStatement = { type: 'ifStatement', condition: '', body: [] };
                currentBlock = currentStatement.body;
            }
            else if (token.value === 'warna') {
                currentStatement = { type: 'elseStatement', body: [] };
                currentBlock = currentStatement.body;
            }
            else if (token.value === 'jab tak') {
                currentStatement = { type: 'whileStatement', condition: '', body: [] };
                currentBlock = currentStatement.body;
            }
            else if (token.value === 'bas kar') {
                currentStatement = { type: 'breakStatement' };
            }
            else if (token.value === 'agla dekh') {
                currentStatement = { type: 'continueStatement' };
            }
            else {
                throw new Error("Invalid keyword: ".concat(token.value));
            }
            ast.push(currentStatement);
        }
        else if (token.type === 'identifier') {
            if (currentStatement.type === 'variableDeclaration') {
                currentStatement.name = token.value;
            }
            else if (currentStatement.type === 'output') {
                currentStatement.expression += token.value;
            }
            else {
                currentStatement.expression += token.value; 
            }
        }
        else if (token.type === 'number' || token.type === 'string') {
            currentStatement.value = token.value;
        }
        else if (token.value === 'nalla' || token.value === 'sahi' || token.value === 'galat') {
            currentStatement.dataType = token.value;
        }
        else {
            throw new Error("Invalid token: ".concat(token.value));
        }
    }
    return ast;
}
// Interpreter
function interpret(ast, symbolTable) {
    if (symbolTable === void 0) { symbolTable = {}; }
    var shouldBreakLoop = false; 
    var shouldContinueLoop = false;
    for (var _i = 0, ast_1 = ast; _i < ast_1.length; _i++) {
        var statement = ast_1[_i];
        if (statement.type === 'variableDeclaration') {
            symbolTable[statement.name] = { value: statement.value, dataType: statement.dataType };
            console.log("Variable declared: ".concat(statement.name, " = ").concat(statement.value));
        }
        else if (statement.type === 'output') {
            var expressionValue = evaluateExpression(statement.expression, symbolTable);
            console.log(expressionValue);
        }
        else if (statement.type === 'ifStatement') {
            if (evaluateCondition(statement.condition, symbolTable)) {
                interpret(statement.body, symbolTable);
            }
            else if (statement.elseBody) {
                interpret(statement.elseBody, symbolTable);
            }
        }
        else if (statement.type === 'whileStatement') {
            while (evaluateCondition(statement.condition, symbolTable)) {
                executeBlock(statement.body, symbolTable); 
            }
        }
        else if (statement.type === 'breakStatement') {
            shouldBreakLoop = true;
        }
        else if (statement.type === 'continueStatement') {
            shouldContinueLoop = true;
        }
        else {
            throw new Error("Invalid statement type: ".concat(statement.type));
        }
    }
}
function executeBlock(block, symbolTable) {
    var shouldBreakLoop = false; 
    var shouldContinueLoop = false;
    for (var _i = 0, block_1 = block; _i < block_1.length; _i++) {
        var statement = block_1[_i];
        interpret(statement, symbolTable);
        if (shouldBreakLoop) {
            break; 
        }
        if (shouldContinueLoop) {
            shouldContinueLoop = false; 
            continue;
        }
    }
}
function evaluateExpression(expression, symbolTable) {
    if (!Number.isNaN(parseFloat(expression))) {
        return parseFloat(expression); 
    }
    else if (expression === 'sahi') {
        return true;
    }
    else if (expression === 'galat') {
        return false; 
    }
    else if (expression.startsWith('"') && expression.endsWith('"')) {
        return expression.slice(1, -1);
    }
    else if (symbolTable[expression]) {
        return symbolTable[expression].value; 
    }
    var parts = expression.split(' ');
    var operator = parts[1];
    var operand1 = evaluateExpression(parts[0], symbolTable);
    var operand2 = evaluateExpression(parts[2], symbolTable);
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            if (operand2 === 0) {
                throw new Error('Division by zero');
            }
            return operand1 / operand2;
        default:
            throw new Error("Invalid operator: ".concat(operator));
    }
}
function evaluateCondition(condition, symbolTable) {
    var comparisonParts = condition.split(' ');
    var operand1 = evaluateExpression(comparisonParts[0], symbolTable);
    var operand2 = evaluateExpression(comparisonParts[2], symbolTable);
    var comparisonOperator = comparisonParts[1];
    switch (comparisonOperator) {
        case '>':
            return operand1 > operand2;
        case '<':
            return operand1 < operand2;
        case '==':
            return operand1 === operand2;
        case '!=':
            return operand1 !== operand2;
        default:
            throw new Error("Invalid comparison operator: ".concat(comparisonOperator));
    }
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
