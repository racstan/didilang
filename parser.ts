"use strict";

interface Token {
    type: string;
    value: string;
}

type ASTNode = Block | Statement;

interface Statement {
    type: string;
    [key: string]: any;
}

interface Block {
    type: 'block';
    statements: ASTNode[];
}

export function parse(tokens: Token[]): Block[] {
    if (tokens.length === 0) {
        throw new Error('No tokens to parse');
    }
    const ast: Block[] = [];
    let currentBlock: Block | undefined; // Change ASTNode[] to Block for type consistency
    let currentStatement: Statement | undefined;
    let currentField = '';

    for (const token of tokens) {
        switch (token.type) {
            case 'start':
                currentBlock = { type: 'block', statements: [] }; // Initialize as a Block directly
                break;
            case 'end':
                if (currentBlock) {
                    ast.push(currentBlock); // Push the currentBlock directly
                    currentBlock = undefined;
                } else {
                    throw new Error('Unexpected end token');
                }
                break;
            case 'variable':
                currentStatement = { type: 'assignment', variable: '', expression: [] };
                if (currentBlock) {
                    currentBlock.statements.push(currentStatement); // Use currentBlock.statements
                } else {
                    throw new Error('Variable statement not within a block');
                }
                currentField = 'variable';
                break;
            case 'print':
                currentStatement = { type: 'output', expression: [] };
                if (currentBlock) {
                    currentBlock.statements.push(currentStatement); // Use currentBlock.statements
                } else {
                    throw new Error('Print statement not within a block');
                }
                currentField = 'expression';
                break;
            case 'conditional':
                currentStatement = { type: 'conditional', condition: [], trueBranch: [], falseBranch: [] };
                if (currentBlock) {
                    currentBlock.statements.push(currentStatement); // Use currentBlock.statements
                } else {
                    throw new Error('Conditional statement not within a block');
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
                        currentField = 'expression';
                    } else if (Array.isArray(currentStatement[currentField])) {
                        currentStatement[currentField].push({ type: token.type, value: token.value });
                    } else {
                        throw new Error(`Cannot push to non-array field: ${currentField}`);
                    }
                }
                break;
            case 'boolean':
                if (currentStatement && currentField && (token.value === 'sahi' || token.value === 'galat')) {
                    const booleanValue = token.value === 'sahi' ? true : false;
                    if (Array.isArray(currentStatement[currentField])) {
                        currentStatement[currentField].push({ type: 'boolean', value: booleanValue });
                    } else {
                        throw new Error(`Cannot push to non-array field: ${currentField} for boolean values`);
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
                }
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