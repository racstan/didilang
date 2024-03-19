export function interpret(ast: any[]): any[] {
  let output: any[] = [];
  let variables: {[key: string]: string | number} = {};
  for (const statement of ast) {
    try {
      if (statement.type === 'assignment') {
        if (statement.value !== '') {
          variables[statement.variable] = Number(statement.value);
        } else if (statement.expression.length > 0) {
          variables[statement.variable] = interpretExpression(statement.expression, variables);
        }
      } else if (statement.type === 'output') {
        const expressionValue = interpretExpression(statement.expression, variables);
        if (expressionValue !== undefined) {
          output.push(expressionValue);
        } else {
          console.error('Could not evaluate expression:', statement.expression);
        }
      }
    } catch (error) {
      console.error('Error interpreting statement:', statement, error);
    }
  }
  return output;
}

function interpretExpression(expression: any[], variables: {[key: string]: string | number}): any {
  let stack: (string | number)[] = [];
  let precedence: {[key: string]: number} = {
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
      stack.push(Number(token.value));
    } else if (token.type === 'identifier') {
      if (variables[token.value] === undefined) {
        throw new Error(`Variable ${token.value} is not defined`);
      }
      stack.push(variables[token.value]);
    } else if (token.type === 'string') {
      stack.push(token.value);
    } else if (token.type === 'operator') {
      while (stack.length > 2 && precedence[typeof stack[stack.length - 2] === 'string' ? stack[stack.length - 2] : ''] >= precedence[token.value]) {
        let operator = stack.pop() as string;
        let operand2 = stack.pop();
        let operand1 = stack.pop();
        stack.push(applyOperator(operator, operand1, operand2));
      }
      stack.push(token.value);
    }
  }

  while (stack.length > 2) {
    let operator = stack.pop() as string;
    let operand2 = stack.pop();
    let operand1 = stack.pop();
    stack.push(applyOperator(operator, operand1, operand2));
  }

  return stack[0];
}

function applyOperator(operator: string, operand1: any, operand2: any): any {
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
      throw new Error(`Operator ${operator} is not supported`);
  }
}