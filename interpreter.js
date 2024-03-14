function interpret(ast, variables) {
    for (var _i = 0, ast_1 = ast; _i < ast_1.length; _i++) {
        var statement = ast_1[_i];
        if (statement.type === 'assignment') {
            variables[statement.variable] = interpretExpression(statement.expression, variables);
        }
        else if (statement.type === 'output') {
            var expressionValue = interpretExpression(statement.expression, variables);
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
    var stack = [];
    var precedence = {
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
    for (var _i = 0, expression_1 = expression; _i < expression_1.length; _i++) {
        var token = expression_1[_i];
        if (token.type === 'number') {
            stack.push(Number(token.value));
        }
        else if (token.type === 'identifier') {
            if (variables[token.value] === undefined) {
                throw new Error("Variable ".concat(token.value, " is not defined"));
            }
            stack.push(variables[token.value]);
        }
        else if (token.type === 'string') {
            stack.push(token.value.slice(1, -1));
        }
        else if (token.type === 'operator') {
            while (stack.length > 1 && precedence[stack[stack.length - 2]] >= precedence[token.value]) {
                var operator = stack.pop();
                var operand2 = stack.pop();
                var operand1 = stack.pop();
                stack.push(applyOperator(operator, operand1, operand2));
            }
            stack.push(token.value);
        }
    }
    while (stack.length > 1) {
        var operator = stack.pop();
        var operand2 = stack.pop();
        var operand1 = stack.pop();
        stack.push(applyOperator(operator, operand1, operand2));
    }
    return stack[0];
}
function applyOperator(operator, operand1, operand2) {
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
        case '%':
            return operand1 % operand2;
        case '**':
            return Math.pow(operand1, operand2);
        case '>':
            return operand1 > operand2 ? 1 : 0;
        case '<':
            return operand1 < operand2 ? 1 : 0;
        case '==':
            return operand1 == operand2 ? 1 : 0;
        case '!=':
            return operand1 != operand2 ? 1 : 0;
        case '>=':
            return operand1 >= operand2 ? 1 : 0;
        case '<=':
            return operand1 <= operand2 ? 1 : 0;
        case '&&':
            return (operand1 !== 0 && operand2 !== 0) ? 1 : 0;
        case '||':
            return (operand1 !== 0 || operand2 !== 0) ? 1 : 0;
        default:
            throw new Error("Operator ".concat(operator, " is not supported"));
    }
}
