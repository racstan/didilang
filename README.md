
# Didilang

Didilang is a toy programming language written in Typescript. It is the sister of Bhailang.


## Installation

Go to your project directory and install Didilang.

```bash
npm i didilang didirunner
```
Then, add the following to the ```scripts``` section of your ```package.json```:

```bash
"start": "node ./node_modules/didirunner/run.js"
```

Your package.json file should be looking similar to this:
```bash
{
  "scripts": {
    "start": "node ./node_modules/didirunner/run.js"
  },
  "dependencies": {
    "didilang": "^1.0.5",
    "didirunner": "^1.0.1"
  }
}
```

Didilang is subject to constant improvements hence use the following command in your project directory to stay updated.
```bash
npm update
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
Run the code using ```npm start -- your-file-name.js```

Example 1:
```javascript
hi didi
bol didi "Hello World";
bye didi
```
Outputs:  ```[ 'Hello World!' ]```

Example 2:
```javascript
hi didi
didi ye hai a=5;
didi ye hai b=10;
bol didi a+b;
bol didi a-b;
bol didi a*b;
bol didi a/b;
bye didi
```
Outputs:  ```[ 15, -5, 50, 0.5 ]```



## Roadmap
- Improve code syntax

- Add more keywords

- Add functions

- Improve Error Handling

- Add Debugging Tools

- Code Optimization


