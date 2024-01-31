import * as readline from 'readline';

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
  "Kya kar rhi hai tu": "Invalid syntax",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let code = '';

console.log('Please enter your code: ');

rl.on('line', (input) => {
  code += input + '\n';
  if (input.trim() === 'bye didi') {
    rl.close();
  }
});

rl.on('close', () => {
  try {
    const tokens = tokenize(code);
    console.log(tokens);
  } catch (error) {
    console.error(error.message);
  }
});

interface Token {
  type: string;
  value: string;
}

function tokenize(code: string): Token[] {
  code = code.trim();
  if (!code.startsWith('hi didi') || !code.endsWith('bye didi')) {
    throw new Error('Code must start with "hi didi" and end with "bye didi".');
  }
  const tokens: Token[] = [];
  const regex = /(?<=^|\s)(hi didi|bye didi|jab tak didi|agar didi|warna didi|bol didi|didi ye hai|nalla|sahi|galat)(?=\s|$)|"((?:\\.|[^"\\])*)"|[a-zA-Z_]\w*|\d+|==|<=|>=|!=|\+|-|\*|\/|%|\(|\)|\{|\}|;|,|\/\/.*/g;
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
      token.value = JSON.parse(token.value); // unescape the escaped characters
    } else if (/[a-zA-Z_]\w*/.test(token.value)) {
      token.type = 'identifier';
    } else if (/\d+/.test(token.value)) {
      token.type = 'number';
    } else if (/\/\/.*/.test(token.value)) {
      token.type = 'comment';
    } else if (/==|<=|>=|!=|\+|-|\*|\/|%/.test(token.value)) {
      token.type = 'operator';
    } else if (/\(|\)|\{|\}|;|,/.test(token.value)) {
      token.type = 'delimiter';
    }
  
    tokens.push(token);
  }
  
  return tokens;
}