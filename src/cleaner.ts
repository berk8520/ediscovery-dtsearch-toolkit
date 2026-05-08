import { Lexer, TokenType } from './lexer';

export function cleanText(rawText: string): string {
    const text = rawText.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    const lines = text.split(/\r?\n/);
    let finalFormatted = '';
    
    for (let l = 0; l < lines.length; l++) {
        const lineText = lines[l].trim();
        if (!lineText) {
            finalFormatted += '\n';
            continue;
        }

        const lexer = new Lexer(lineText);
        const tokens = lexer.tokenize();
        
        let formatted = '';

        for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i];
            if (t.type === TokenType.EOF) break;

            if (t.type === TokenType.LParen) {
                if (formatted.length > 0 && !formatted.endsWith(' ')) {
                    formatted += ' ';
                }
                formatted += '(';
            } else if (t.type === TokenType.RParen) {
                if (formatted.endsWith(' ')) {
                    formatted = formatted.slice(0, -1);
                }
                formatted += ')';
            } else {
                if (formatted.length > 0 && !formatted.endsWith(' ') && !formatted.endsWith('(')) {
                    formatted += ' ';
                }
                formatted += t.value;
            }
        }
        
        finalFormatted += formatted + (l < lines.length - 1 ? '\n\n' : '');
    }

    return finalFormatted.trim();
}
