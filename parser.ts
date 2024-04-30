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
      case 'didi ye function':
        case 'function':
          currentStatement = { type: 'function', name: '', params: [], body: [] };
          if (currentBlock) {
            currentBlock.push(currentStatement);
          } else {
            ast.push(currentStatement);
          }
          currentField = 'params'; // changed from 'name' to 'params'
          break;
        case 'call':
          currentStatement = { type: 'call', name: '', args: [] };
          if (currentBlock) {
            currentBlock.push(currentStatement);
          } else {
            ast.push(currentStatement);
          }
          currentField = 'params'; // changed from 'name' to 'params'
          break;
      case 'comment':
      case 'multiline_comment':
        // Ignore comments
        break;
      case 'didi ye hai':
          currentStatement = { type: 'assignment', variable: '', expression: [] };
          if (currentBlock) {
            currentBlock.push(currentStatement);
          } else {
            ast.push(currentStatement);
          }
          currentField = 'variable';
        break;
      case 'delimiter':
        switch (token.value) {
          case '(':
          case '{':
            if (currentField !== 'condition' && currentField !== 'params' && currentField !== 'args' && currentField !== 'name') {
              throw new Error('Unexpected left parenthesis or brace');
            }
            if (currentStatement && currentStatement.type === 'if') {
              currentField = currentField === 'condition' ? 'trueBranch' : 'falseBranch';
            } else if (currentStatement && (currentStatement.type === 'call' || currentStatement.type === 'function')) {
              currentField = 'args';
            }
            break;
          case ')':
          case '}':
            if (currentField !== 'trueBranch' && currentField !== 'falseBranch' && currentField !== 'params' && currentField !== 'args') {
              throw new Error('Unexpected right parenthesis or brace');
            }
            currentField = '';
            break;
          case ',':
            if (currentField !== 'params' && currentField !== 'args') {
              throw new Error('Unexpected comma');
            }
            break;
          default:
            throw new Error(`Unexpected delimiter: ${token.value}`);
        }
        break;
      case 'bol didi':
        currentStatement = { type: 'output', expression: [] };
        if (currentBlock) {
          currentBlock.push(currentStatement);
        } else {
          ast.push(currentStatement);
        }
        currentField = 'expression';
        break;
      case 'agar didi': // Handle 'agar didi' tokens
        currentStatement = { type: 'if', condition: [], trueBranch: [], falseBranch: [] };
        if (currentBlock) {
          currentBlock.push(currentStatement);
        } else {
          ast.push(currentStatement);
        }
        currentField = 'condition';
        break;
      case 'warna didi': // Handle 'warna didi' tokens
        if (currentStatement && currentStatement.type === 'if' && currentField === '') {
          currentField = 'falseBranch';
        } else {
          throw new Error('Unexpected warna didi token');
        }
        break;
        case 'identifier':
        case 'number':
        case 'arithmetic_operator':
        case 'string':
          if (currentStatement && currentField) {
            if (currentField === 'variable') {
              currentStatement.variable = token.value;
              currentField = 'expression';
            } else if (currentField === 'name') {
              currentStatement.name = token.value;
              currentField = 'params';
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
      default:
        throw new Error(`Unknown token type: ${token.type}`);
    }
  }

  if (currentBlock) {
    throw new Error('Unclosed block');
  }

  return ast;
}