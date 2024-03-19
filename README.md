
# Didilang

Didilang is a toy programming language written in Typescript. It is the sister of Bhailang.




## Installation

Install Didilang  with npm

```bash
npm i didilang didirunner
```
Then, add the following to the ```scripts``` section of your ```package.json```:

```bash
"start": "node ./node_modules/didirunner/run.js"```

Your package.json file should be looking similar to this:
```bash
{
  "scripts": {
    "start": "node ./node_modules/didirunner/run.js"
  },
  "dependencies": {
    "didilang": "^1.0.3",
    "didirunner": "^1.0.0"
  }
}
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
hi didi
bol didi "Hello World";
bye didi
```
Run the code using ```npm start -- your-file-name.js```

(Or run the code using the code given below)
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

Run the code using ```node your-file-name.js```


## Roadmap
- Improve code syntax

- Add more keywords

- Add functions

- Improve Error Handling

- Add Debugging Tools

- Code Optimization


