"use strict";
import { applyOperatorToStack } from "./operatorUtils";

interface Token {
    type: string;
    value: string;
}

interface Statement {
    type: string;
    [key: string]: any;
}

interface VariableMap {
    [key: string]: any;
}

export function interpret(ast: Statement[], variables: VariableMap = {}): any[] {
    let output: any[] = [];

    for (const statement of ast) {
        try {
            switch (statement.type) {
                case 'assignment':
                    if (!statement.variable || statement.expression === undefined)
                        throw new Error('Invalid assignment statement');
                    variables[statement.variable] = interpretExpression(statement.expression, variables);
                    break;
                case 'output':
                    if (statement.expression === undefined)
                        throw new Error('Invalid output statement');
                    output.push(interpretExpression(statement.expression, variables));
                    break;
                case 'conditional':
                    if (!statement.condition || !statement.trueBranch)
                        throw new Error('Invalid conditional statement');
                    if (interpretExpression(statement.condition, variables)) {
                        output = output.concat(interpret(statement.trueBranch, variables));
                    } else if (statement.falseBranch) {
                        output = output.concat(interpret(statement.falseBranch, variables));
                    }
                    break;
                case 'block':
                    if (!statement.statements)
                        throw new Error('Invalid block statement');
                    output = output.concat(interpret(statement.statements, variables));
                    break;
                default:
                    throw new Error(`Unknown statement type: ${statement.type}`);
            }
        } catch (error) {
            console.error('Error interpreting statement:', statement, error);
        }
    }
    return output;
}

function interpretExpression(expression: Token[] | Token, variables: VariableMap): any {
    if (!Array.isArray(expression)) {
        expression = [expression];
    }

    let stack: any[] = [];
    const precedence: { [key: string]: number } = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2,
        '**': 3,
        '>': 0,
        '<': 0,
        '==': 0,
        '!=': 0,
        '>=': 0,
        '<=': 0,
        '&&': -1,
        '||': -1
    };

    for (const token of expression) {
        switch (token.type) {
            case 'number':
                stack.push(Number(token.value));
                break;
            case 'variable':
            case 'identifier':
                if (variables[token.value] === undefined) {
                    console.error(`Variable ${token.value} is not defined. Initializing with null.`);
                    variables[token.value] = null; // Initialize undefined variables with null
                }
                stack.push(variables[token.value]);
                break;
            case 'string':
                stack.push(token.value);
                break;
            case 'boolean':
                stack.push(token.value === 'true');
                break;
            case 'arithmetic_operator':
            case 'operator':
                while (stack.length > 1 && precedence[stack[stack.length - 2]] >= precedence[token.value]) {
                    applyOperatorToStack(stack);
                }
                stack.push(token.value);
                break;
            default:
                throw new Error(`Unknown token type: ${token.type}`);
        }
    }
    while (stack.length > 1) {
        applyOperatorToStack(stack);
    }
    return stack[0];
}