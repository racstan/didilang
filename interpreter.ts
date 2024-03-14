function interpret(ast: any[], variables: {[key: string]: string | number}): void {
  for (const statement of ast) {
    if (statement.type === 'assignment') {
      variables[statement.variable] = interpretExpression(statement.expression, variables);
    } else if (statement.type === 'output') {
      const expressionValue = interpretExpression(statement.expression, variables);
      if (expressionValue !== undefined) {
        console.log(expressionValue);
      } else {
        console.error('Could not evaluate expression:', statement.expression);
      }
    }
  }
  return;
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
        stack.push(token.value.slice(1, -1));
      } else if (token.type === 'operator') {
        while (stack.length > 1 && precedence[stack[stack.length - 2]] >= precedence[token.value]) {
          let operator = stack.pop() as string;
          let operand2 = stack.pop() as number;
          let operand1 = stack.pop() as number;
          stack.push(applyOperator(operator, operand1, operand2));
        }
        stack.push(token.value);
      }
    }
  
    while (stack.length > 1) {
      let operator = stack.pop() as string;
      let operand2 = stack.pop() as number;
      let operand1 = stack.pop() as number;
      stack.push(applyOperator(operator, operand1, operand2));
    }
  
    return stack[0];
  }
  
  function applyOperator(operator: string, operand1: number, operand2: number): number {
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