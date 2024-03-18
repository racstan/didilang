
# Didilang

Didilang is a toy programming language written in Typescript. It is the sister of Bhailang.




## Installation

Install Didilang with npm

```bash
  npm i didilang
```
    

## Documentation


Keywords
```
    "hi didi": "start",
    "bye didi": "end",
    "didi ye hai": "variable",
    "bol didi": "print",
    "agar didi": "if",
    "warna didi": "else",
    "jab tak didi": "while",
    "bas kar didi": "break",
    "agla dekh didi": "continue",

```
Data types
```
    "nalla": "null",
    "sahi": "true",
    "galat": "false",
```

Error message
```
    "Kya kar rhi hai tu": "Invalid syntax"
```

## Usage/Examples
Create a new file (```test.js```)
```javascript
const didilang = require('didilang');

//Provide code as a string

const code = 'hi didi bol didi "hi" bye didi';

//Use the following methods to tokenize, parse and interpret the result

const tokens = didilang.lexer.tokenize(code);
const ast = didilang.parser.parse(tokens);
const interpreterresult = didilang.interpreter.interpret(ast, {});

//View the results
 
console.log(code);
console.log(tokens);
console.log(ast);
console.log(interpreterresult);
```


## Roadmap
- Improve code syntax

- Add more keywords

- Add functions

- Improve Error Handling

- Add Debugging Tools

- Code Optimization


