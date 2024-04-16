import { FunctionDefinition } from './types';

function applyOperatorToStack(stack: any[], functions: {[key: string]: FunctionDefinition}) {
  const right = stack.pop();
  const operator = stack.pop();
  const left = stack.pop();

  if (typeof operator !== 'string' || !['+', '-', '*', '/', '%', '**', '>', '<', '==', '!=', '>=', '<=', '&&', '||'].includes(operator)) {
    throw new Error(`Operator ${operator} is not supported`);
  } else if (typeof operator === 'string' && operator in functions) {
    const func = functions[operator];
    if (!func) throw new Error(`Function ${operator} is not defined`);
    if (func.params.length !== 2) throw new Error(`Function ${operator} expects 2 arguments but got ${func.params.length}`);
    const oldVariables = {...variables};
    variables[func.params[0]] = left;
    variables[func.params[1]] = right;
    const result = interpret(func.body);
    variables = oldVariables;
    stack.push(result);
  } else {
    stack.push(applyOperator(operator, left, right));
  }
}


  stack.push(applyOperator(operator, left, right));
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


export { applyOperatorToStack, applyOperator };