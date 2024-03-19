const fs = require('fs');
const didilang = require('didilang');

// Get the filename from the command line arguments
const filename = process.argv[2];

// Read the code from the file
const code = fs.readFileSync(filename, 'utf-8');

// Tokenize, parse, and interpret the code
const tokens = didilang.lexer.tokenize(code);
const ast = didilang.parser.parse(tokens);
const interpreterresult = didilang.interpreter.interpret(ast, {});

// Log the results
console.log(tokens);
console.log(ast);
console.log(interpreterresult);