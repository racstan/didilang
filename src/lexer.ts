import * as readline from 'readline';


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let code = '';
let variables: { [key: string]: any } = {};
const didiDict: { [key: string]: string } = {
  // Keywords
  "hi didi": "start",
  "bye didi": "end",
  "didi ye hai": "variable",
  "bol didi": "print",
  "agar didi": "if",
  "warna didi": "else",
  "jab tak didi": "while",
  "bas kar didi": "break",
  "agla dekh didi": "continue",

  // Data types
  "nalla": "null",
  "sahi": "true",
  "galat": "false",

  // Error message
  "Kya kar rhi hai tu": "Invalid syntax"
};

console.log('Please enter your code: ');

let isInputComplete = false;

rl.on('line', (input) => {
  code += input + '\n';
  if (input.trim() === 'bye didi') {
    isInputComplete = true;
    rl.close();
  }
}); 

rl.on('close', () => {
  if (isInputComplete) {
    try {
      const tokens = tokenize(code);
      let ast = parse(tokens);
      interpret(ast);
    } catch (error) {
      console.error(error.message);
    }
  } else {
    console.error('Input was not complete. Please make sure to end your code with "bye didi".');
  }
  setTimeout(() => process.exit(), 5000);
});

interface Token {
  type: string;
  value: string;
}

function tokenize(code: string): Token[] {
  if (!didiDict) {
    throw new Error('didiDict is not defined');
  }

  code = code.trim();
  if (!code.startsWith('hi didi') || !code.endsWith('bye didi')) {
    throw new Error('Code must start with "hi didi" and end with "bye didi".');
  }
  const tokens: Token[] = [];
  const regex = /(?<=^|\s)(hi didi|bye didi|jab tak didi|agar didi|warna didi|bol didi|didi ye hai|nalla|sahi|galat)(?=\s|$)|"((?:\\.|[^"\\])*)"|[a-zA-Z_]\w*|\d+|==|<=|>=|!=|\+|-|\*|\/|%|\(|\)|\{|\}|,|\/\/.*/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const token: Token = {
      type: 'unknown',
      value: match[0].trim(),
    };
  
    if (didiDict[token.value]) {
      token.type = didiDict[token.value];
    } else if (/^".*"$/.test(token.value)) {
      token.type = 'string';
      // Remove the quotation marks from the start and end of the string
      token.value = token.value.slice(1, -1);
    } else if (/[a-zA-Z_]\w*/.test(token.value)) {
      token.type = 'identifier';
    } else if (/\d+/.test(token.value)) {
      token.type = 'number';
    } else if (/\/\/.*/.test(token.value)) {
      token.type = 'comment';
    } else if (/==|<=|>=|!=/.test(token.value)) {
      token.type = 'comparison_operator';
    } else if (/\+|-|\*|\/|%/.test(token.value)) {
      token.type = 'arithmetic_operator';
    } else if (/=/.test(token.value)) {
      token.type = 'assignment_operator';
    } else if (/\(|\)|\{|\}|,/.test(token.value)) { // removed semicolon from the regex
      token.type = 'delimiter';
    }
    tokens.push(token);
  }
  
  return tokens;
}