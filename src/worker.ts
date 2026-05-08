import { parentPort } from 'worker_threads';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { expandAST } from './expander';

parentPort?.on('message', (query: string) => {
    try {
        const normalizedQuery = query.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        const inputLines = normalizedQuery.split(/\r?\n/);
        let finalResults: string[] = [];
        
        for (let i = 0; i < inputLines.length; i++) {
            const line = inputLines[i].trim();
            if (!line) {
                finalResults.push('');
                continue;
            }
            
            const lexer = new Lexer(line);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            const ast = parser.parse();
            
            const expanded = expandAST(ast);
            finalResults = finalResults.concat(expanded);
            if (i < inputLines.length - 1) {
                finalResults.push(''); // add a blank line between query outputs
            }
        }
        
        parentPort?.postMessage({ success: true, result: finalResults });
    } catch (err: any) {
        parentPort?.postMessage({ success: false, error: err.message });
    }
});
