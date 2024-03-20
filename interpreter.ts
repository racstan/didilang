type Token = {
  type: string;
  value: string | number;
};

type Expression = Token[];
type Statement = {
  type: string;
  variable?: string;
  value?: Expression;
  expression?: Expression;
  condition?: Expression;
  trueBranch?: Statement[];
  falseBranch?: Statement[];
};
export function interpret(ast: Statement[]): any[] {
  let output: any[] = [];
  let variables: {[key: string]: string | number} = {};

  for (const statement of ast) {
    try {
      switch (statement.type) {
        case 'assignment':
          variables[statement.variable!] = interpretExpression(statement.value!, variables);
          break;
        case 'output':
          const expressionValue = interpretExpression(statement.expression!, variables);
          // ...
          break;
        case 'conditional':
          if (interpretExpression(statement.condition!, variables) !== 0) {
            output.push(...interpret(statement.trueBranch!));
          } else if (statement.falseBranch) {
            output.push(...interpret(statement.falseBranch));
          }
          break;
        default:
          throw new Error(`Unknown statement type: ${statement.type}`);
      }
    } catch (error) {
      console.error('Error interpreting statement:', statement, error);
    }
  }

  return output;
}

function interpretExpression(expression: Expression, variables: {[key: string]: string | number}): any {
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
    switch (token.type) {
      case 'number':
        stack.push(Number(token.value));
        break;
      case 'variable':
        if (variables[token.value] === undefined) {
          throw new Error(`Variable ${token.value} is not defined`);
        }
        stack.push(variables[token.value]);
        break;
      case 'string':
        stack.push(token.value);
        break;
      case 'operator':
        while (stack.length > 2 && precedence[typeof stack[stack.length - 2] === 'string' ? stack[stack.length - 2] : ''] >= precedence[token.value]) {
          let operator = stack.pop() as string;
          let operand2 = stack.pop();
          let operand1 = stack.pop();
          stack.push(applyOperator(operator, operand1, operand2));
        }
        stack.push(token.value);
        break;
      default:
        throw new Error(`Unknown token type: ${token.type}`);
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