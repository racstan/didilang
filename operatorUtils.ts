function applyOperatorToStack(stack: any[]) {
    const operator = stack[stack.length - 2];
    const right = stack.pop();
    const left = stack.pop();
  
    if (typeof operator !== 'string' || !['+', '-', '*', '/', '%', '**', '>', '<', '==', '!=', '>=', '<=', '&&', '||'].includes(operator)) {
      throw new Error(`Operator ${operator} is not supported`);
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