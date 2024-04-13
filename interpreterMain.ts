import { applyOperatorToStack } from './operatorUtils';

type Token = {
    type: string;
    value: string | number;
};

type Expression = Token[];
type Statement = {
    type: string;
    variable?: string;
    value?: Expression;
    expression?: Expression;
    condition?: Expression;
    trueBranch?: Statement[];
    falseBranch?: Statement[];
    statements?: Statement[];
};

function interpret(ast: Statement[]): any[] {
    let output: any[] = [];
    let variables: {[key: string]: any} = {};

    for (const statement of ast) {
        try {
            switch (statement.type) {
                case 'comment':
                case 'multiline_comment':
                    // Ignore comments
                    break;
                case 'assignment':
                    if (!statement.variable || !statement.expression) throw new Error('Invalid assignment statement');
                    variables[statement.variable] = interpretExpression(statement.expression, variables);
                    break;
                case 'output':
                    if (!statement.expression) throw new Error('Invalid output statement');
                    output.push(interpretExpression(statement.expression, variables));
                    break;
                case 'conditional':
                    if (!statement.condition || !statement.trueBranch) throw new Error('Invalid conditional statement');
                    if (interpretExpression(statement.condition, variables) !== 0) {
                        output.push(...interpret(statement.trueBranch));
                    } else if (statement.falseBranch) {
                        output.push(...interpret(statement.falseBranch));
                    }
                    break;
                case 'block':
                    if (!statement.statements) throw new Error('Invalid block statement');
                    for (const innerStatement of statement.statements) {
                        switch (innerStatement.type) {
                            case 'assignment':
                                if (!innerStatement.variable || !innerStatement.expression) throw new Error('Invalid assignment statement');
                                variables[innerStatement.variable] = interpretExpression(innerStatement.expression, variables);
                                break;
                            case 'output':
                                if (!innerStatement.expression) throw new Error('Invalid output statement');
                                output.push(interpretExpression(innerStatement.expression, variables));
                                break;
                            case 'conditional':
                                if (!innerStatement.condition || !innerStatement.trueBranch) throw new Error('Invalid conditional statement');
                                if (interpretExpression(innerStatement.condition, variables) !== 0) {
                                    output.push(...interpret(innerStatement.trueBranch));
                                } else if (innerStatement.falseBranch) {
                                    output.push(...interpret(innerStatement.falseBranch));
                                }
                                break;
                            default:
                                throw new Error(`Unknown inner statement type: ${innerStatement.type}`);
                        }
                    }
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
   

function interpretExpression(expression: Expression, variables: {[key: string]: any}): any {
    let stack: any[] = [];
    let precedence: {[key: string]: number} = {
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
            case 'comment':
            case 'multiline_comment':
                // Ignore comments
                break;
            case 'number':
                stack.push(Number(token.value));
                break;
            case 'variable':
            case 'identifier':
                if (variables[token.value] === undefined) {
                    throw new Error(`Variable ${token.value} is not defined`);
                }
                stack.push(variables[token.value]);
                break;
            case 'string':
                stack.push(token.value);
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

export { interpret, interpretExpression };