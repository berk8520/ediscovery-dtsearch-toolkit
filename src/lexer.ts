export enum TokenType {
    Term,
    And,
    Or,
    Not,
    Prox,
    LParen,
    RParen,
    EOF
}

export interface Token {
    type: TokenType;
    value: string;
}

export class Lexer {
    private text: string;
    private pos: number = 0;

    constructor(text: string) {
        this.text = text;
    }

    private peek(): string {
        return this.pos < this.text.length ? this.text[this.pos] : '';
    }

    private advance(): string {
        return this.text[this.pos++];
    }

    private skipWhitespace() {
        while (this.pos < this.text.length && /\s/.test(this.peek())) {
            this.advance();
        }
    }

    public getNextToken(): Token {
        this.skipWhitespace();

        if (this.pos >= this.text.length) {
            return { type: TokenType.EOF, value: '' };
        }

        const char = this.peek();

        if (char === '(') {
            this.advance();
            return { type: TokenType.LParen, value: '(' };
        }

        if (char === ')') {
            this.advance();
            return { type: TokenType.RParen, value: ')' };
        }

        if (char === '"') {
            let value = this.advance(); // consume opening quote
            while (this.pos < this.text.length && this.peek() !== '"') {
                if (this.peek() === '\\') {
                    value += this.advance();
                }
                value += this.advance();
            }
            if (this.peek() === '"') {
                value += this.advance(); // consume closing quote
            }
            return { type: TokenType.Term, value: value.toLowerCase() };
        }

        // Read word
        let value = '';
        while (this.pos < this.text.length && !/\s|\(|\)|"/.test(this.peek())) {
            value += this.advance();
        }

        const upperValue = value.toUpperCase();

        // Normalize LexisNexis /s, /p to W/20, W/50
        if (upperValue === '/S') return { type: TokenType.Prox, value: 'W/20' };
        if (upperValue === '/P') return { type: TokenType.Prox, value: 'W/50' };

        // Normalize LexisNexis ! to *
        if (value.includes('!')) {
            value = value.replace(/!/g, '*');
        }

        // Check operators
        if (upperValue === 'AND') return { type: TokenType.And, value: 'AND' };
        if (upperValue === 'OR') return { type: TokenType.Or, value: 'OR' };
        if (upperValue === 'NOT') return { type: TokenType.Not, value: 'NOT' };

        // Proximity matches: W/5, PRE/5, NEAR(5)
        if (/^(W|PRE)\/\d+$/i.test(upperValue)) {
            return { type: TokenType.Prox, value: upperValue };
        }

        // Normalize NEAR(n) or NEAR/n to W/n
        if (upperValue === 'NEAR') {
            const peekAhead = this.text.substring(this.pos);
            const parensMatch = /^\(\s*(\d+)\s*\)/.exec(peekAhead);
            if (parensMatch) {
                this.pos += parensMatch[0].length;
                return { type: TokenType.Prox, value: `W/${parensMatch[1]}` };
            }
            return { type: TokenType.Prox, value: 'W/15' };
        }

        const nearMatch = /^NEAR\/(\d+)$/i.exec(upperValue);
        if (nearMatch) {
            return { type: TokenType.Prox, value: `W/${nearMatch[1]}` };
        }

        // Return term in lowercase
        return { type: TokenType.Term, value: value.toLowerCase() };
    }

    public tokenize(): Token[] {
        const tokens: Token[] = [];
        let token = this.getNextToken();
        while (token.type !== TokenType.EOF) {
            tokens.push(token);
            token = this.getNextToken();
        }
        tokens.push(token);
        return tokens;
    }
}
