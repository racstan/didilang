type Token = {
  type: string;
  value: string;
};

interface Statement {
  type: string;
  [key: string]: any;
}

export function parse(tokens: Token[]): Statement[] {
  if (tokens.length === 0) {
    throw new Error('No tokens to parse');
  }

  const ast: Statement[] = [];
  let currentStatement: Statement | undefined;
  let currentField: string = '';

  for (const token of tokens) {
    switch (token.type) {
      case 'variable':
        currentStatement = { type: 'assignment', variable: '', value: '', expression: [] };
        ast.push(currentStatement);
        currentField = 'variable';
        break;
      case 'print':
        currentStatement = { type: 'output', expression: [] };
        ast.push(currentStatement);
        currentField = 'expression';
        break;
      case 'conditional':
        currentStatement = { type: 'conditional', condition: [], trueBranch: [], falseBranch: [] };
        ast.push(currentStatement);
        currentField = 'condition';
        break;
      case 'identifier':
        if (currentStatement && currentField === 'variable') {
          currentStatement.variable = token.value;
          currentField = '';
        } else if (currentStatement) {
          currentStatement[currentField].push({ type: 'variable', value: token.value });
        }
        break;
      case 'number':
        if (currentStatement && currentField === 'value') {
          currentStatement['value'] = token.value;
        } else if (currentStatement && currentField === 'expression') {
          currentStatement['expression'].push({ type: 'number', value: token.value });
        }
        break;
      case 'arithmetic_operator':
        if (currentStatement) {
          currentStatement[currentField].push({ type: 'operator', value: token.value });
        }
        break;
      case 'string':
        if (currentStatement) {
          currentStatement[currentField].push({ type: 'string', value: token.value });
        }
        break;
      case 'assignment_operator':
        if (currentField !== 'variable') {
          throw new Error('Unexpected assignment operator');
        }
        currentField = 'value';
        break;
      case 'leftParen':
      case 'leftBrace':
        if (currentField !== 'condition') {
          throw new Error('Unexpected left parenthesis or brace');
        }
        currentField = currentField === 'condition' ? 'trueBranch' : 'falseBranch';
        break;
      case 'rightParen':
      case 'rightBrace':
        if (currentField !== 'trueBranch' && currentField !== 'falseBranch') {
          throw new Error('Unexpected right parenthesis or brace');
        }
        currentField = '';
        break;
      default:
        throw new Error(`Unknown token type: ${token.type}`);
    }
  }

  return ast;
}