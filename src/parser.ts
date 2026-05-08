import { Token, TokenType } from './lexer';
import { ASTNode } from './ast';

export class Parser {
    private tokens: Token[];
    private pos = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private peek(): Token {
        return this.pos < this.tokens.length ? this.tokens[this.pos] : { type: TokenType.EOF, value: '' };
    }

    private advance(): Token {
        return this.tokens[this.pos++];
    }

    public parse(): ASTNode | null {
        if (this.tokens.length === 0 || this.peek().type === TokenType.EOF) return null;
        return this.parseExpression(0);
    }

    private parseExpression(minPrecedence: number): ASTNode {
        let left = this.parsePrimary();

        while (true) {
            const token = this.peek();
            if (token.type === TokenType.EOF || token.type === TokenType.RParen) {
                break;
            }

            const precedence = this.getPrecedence(token);
            if (precedence < minPrecedence) {
                break;
            }

            this.advance(); // consume operator
            
            const right = this.parseExpression(precedence + 1); // left-associative
            left = { type: 'Binary', operator: token.value.toUpperCase(), left, right };
        }

        return left;
    }

    private parsePrimary(): ASTNode {
        const token = this.advance();

        if (token.type === TokenType.LParen) {
            const node = this.parseExpression(0);
            if (this.peek().type === TokenType.RParen) {
                this.advance();
            }
            return { type: 'Group', child: node };
        }

        if (token.type === TokenType.Not) {
            return { type: 'Unary', operator: 'NOT', right: this.parseExpression(40) }; // bind NOT tightly
        }

        if (token.type === TokenType.Term) {
            // handle implicit exact phrase "apple grape banana" without quotes
            let value = token.value;
            while (this.peek().type === TokenType.Term) {
                value += ' ' + this.advance().value;
            }
            return { type: 'Term', value };
        }

        // Fallback for dangling operators
        return { type: 'Term', value: token.value };
    }

    private getPrecedence(token: Token): number {
        switch (token.type) {
            case TokenType.Or: return 30;    // OR is evaluated first in dtSearch
            case TokenType.Prox: return 20;  // Proximity
            case TokenType.And: return 10;   // AND is evaluated last
        }
        return -1;
    }
}
