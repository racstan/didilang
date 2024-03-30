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
  let currentBlock: Statement[] | undefined;
  let currentStatement: Statement | undefined;
  let currentField: string = '';

  for (const token of tokens) {
    switch (token.type) {
      case 'start':
        currentBlock = [];
        break;
      case 'end':
        if (currentBlock) {
          ast.push({ type: 'block', statements: currentBlock });
          currentBlock = undefined;
        } else {
          throw new Error('Unexpected end token');
        }
        break;
      case 'variable':
        currentStatement = { type: 'assignment', variable: '', value: '', expression: [] };
        if (currentBlock) {
          currentBlock.push(currentStatement);
        } else {
          ast.push(currentStatement);
        }
        currentField = 'variable';
        break;
      case 'print':
        currentStatement = { type: 'output', expression: [] };
        if (currentBlock) {
          currentBlock.push(currentStatement);
        } else {
          ast.push(currentStatement);
        }
        currentField = 'expression';
        break;
      case 'conditional':
        currentStatement = { type: 'conditional', condition: [], trueBranch: [], falseBranch: [] };
        if (currentBlock) {
          currentBlock.push(currentStatement);
        } else {
          ast.push(currentStatement);
        }
        currentField = 'condition';
        break;
        case 'identifier':
      case 'number':
      case 'arithmetic_operator':
      case 'string':
        if (currentStatement && currentField) {
          if (currentField === 'variable') {
            currentStatement.variable = token.value;
            currentField = 'value';
          } else if (currentField === 'value') {
            currentStatement.value = token.value;
            currentField = '';
          } else if (Array.isArray(currentStatement[currentField])) {
            currentStatement[currentField].push({ type: token.type, value: token.value });
          } else {
            throw new Error(`Cannot push to non-array field: ${currentField}`);
          }
        }
        break;
      case 'assignment_operator':
        if (currentField !== 'variable') {
          throw new Error('Unexpected assignment operator');
        }
        currentField = 'expression';
        break;
      case 'leftParen':
      case 'leftBrace':
        if (currentField !== 'condition') {
          throw new Error('Unexpected left parenthesis or brace');
        }``
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

  if (currentBlock) {
    throw new Error('Unclosed block');
  }

  return ast;
}