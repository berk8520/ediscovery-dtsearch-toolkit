import * as vscode from 'vscode';

export function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
    if (document.languageId !== 'dtsearch') {
        return;
    }

    const diagnostics: vscode.Diagnostic[] = [];

    for (let lineNum = 0; lineNum < document.lineCount; lineNum++) {
        const line = document.lineAt(lineNum);
        const rawText = line.text;
        if (!rawText.trim()) continue;

        let maskedTextArray = rawText.split('');
        let inQuote = false;
        for (let i = 0; i < maskedTextArray.length; i++) {
            if (maskedTextArray[i] === '"' || maskedTextArray[i] === '“' || maskedTextArray[i] === '”') {
                inQuote = !inQuote;
                maskedTextArray[i] = 'X'; // mask the quote itself with X so it isn't seen as empty space
            } else if (inQuote) {
                maskedTextArray[i] = 'X'; // mask contents with X
            }
        }
        const text = maskedTextArray.join('');

        // 1. Unbalanced Parentheses
        let balance = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '(') balance++;
            else if (text[i] === ')') {
                balance--;
                if (balance < 0) {
                    const range = new vscode.Range(lineNum, i, lineNum, i + 1);
                    diagnostics.push(new vscode.Diagnostic(range, 'Unbalanced closing parenthesis', vscode.DiagnosticSeverity.Error));
                    balance = 0; // reset to avoid cascading
                }
            }
        }
        if (balance > 0) {
            const lastOpen = text.lastIndexOf('(');
            if (lastOpen !== -1) {
                const range = new vscode.Range(lineNum, lastOpen, lineNum, lastOpen + 1);
                diagnostics.push(new vscode.Diagnostic(range, 'Unbalanced opening parenthesis', vscode.DiagnosticSeverity.Error));
            }
        }

        // 1.5. Unclosed Quotes
        const quoteCount = (rawText.match(/["“”]/g) || []).length;
        if (quoteCount % 2 !== 0) {
            const lastQuoteIdx = Math.max(rawText.lastIndexOf('"'), rawText.lastIndexOf('“'), rawText.lastIndexOf('”'));
            const range = new vscode.Range(lineNum, lastQuoteIdx, lineNum, lastQuoteIdx + 1);
            diagnostics.push(new vscode.Diagnostic(range, 'Unclosed quotation mark. This can cause the search engine to fail.', vscode.DiagnosticSeverity.Error));
        }

        // 1.7. Smart Quotes
        let match;
        const smartQuoteRegex = /[“”‘’]/g;
        while ((match = smartQuoteRegex.exec(rawText)) !== null) {
            const range = new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(range, `Smart quotes found. These will not be recognized by dtSearch.`, vscode.DiagnosticSeverity.Error));
        }

        // 2. Lexis/Westlaw Pollution & Missing Operators
        const lexisRegex = /\bNEAR\s*(?:\(\s*\d+\s*\)|\/\s*\d+)?|\/[sp]|\bAND\b\s*(?=\s*$)|(?<=^\s*)\bAND\b|!|\)\s*\(/gi;
        while ((match = lexisRegex.exec(text)) !== null) {
            const matchedText = match[0].toUpperCase();
            const range = new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length);
            
            if (matchedText.includes('NEAR')) {
                const numMatch = matchedText.match(/\d+/);
                const num = numMatch ? numMatch[0] : '15';
                diagnostics.push(new vscode.Diagnostic(range, `Invalid proximity operator. Use W/${num} instead of NEAR.`, vscode.DiagnosticSeverity.Warning));
            } else if (matchedText === '/S' || matchedText === '/P') {
                diagnostics.push(new vscode.Diagnostic(range, `Lexis/Westlaw proximity (${matchedText}) not supported. Use W/20 or W/50.`, vscode.DiagnosticSeverity.Warning));
            } else if (matchedText.includes('AND')) {
                diagnostics.push(new vscode.Diagnostic(range, `Boundary AND found. AND operator requires both a left and right expression.`, vscode.DiagnosticSeverity.Error));
            } else if (matchedText === '!') {
                diagnostics.push(new vscode.Diagnostic(range, `Lexis/Westlaw wildcard (!) found. Use * instead.`, vscode.DiagnosticSeverity.Warning));
            } else if (matchedText.includes(')') && matchedText.includes('(')) {
                diagnostics.push(new vscode.Diagnostic(range, `Missing operator between parenthesis groups. Add AND, OR, or W/N.`, vscode.DiagnosticSeverity.Error));
            }
        }

        // 2.5 Double Operators & Missing Proximity Numbers
        const doubleOpRegex = /\b(?:AND|OR)\s+(?:AND|OR)\b|\bNOT\s+(?:AND|OR|NOT)\b/gi;
        while ((match = doubleOpRegex.exec(text)) !== null) {
            const range = new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(range, `Consecutive logical operators found: '${match[0]}'.`, vscode.DiagnosticSeverity.Error));
        }

        const missingProxRegex = /\b(?:W|PRE)\/(?!\d)/gi;
        while ((match = missingProxRegex.exec(text)) !== null) {
            const range = new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(range, `Missing proximity number after '${match[0]}'.`, vscode.DiagnosticSeverity.Error));
        }

        // 3. Leading Wildcards
        const leadingWildcardRegex = /(?<!\S)[\*\?][a-zA-Z0-9]+/g;
        while ((match = leadingWildcardRegex.exec(text)) !== null) {
            const range = new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(range, `Leading wildcard '${match[0]}' can cause performance issues.`, vscode.DiagnosticSeverity.Warning));
        }

        // 3.5. Internal Wildcards
        const internalWildcardRegex = /\b([a-zA-Z0-9]+)\*([a-zA-Z0-9]+)\b/g;
        while ((match = internalWildcardRegex.exec(text)) !== null) {
            const range = new vscode.Range(lineNum, match.index + match[1].length, lineNum, match.index + match[1].length + 1);
            diagnostics.push(new vscode.Diagnostic(range, `Internal wildcard '*' matches 0 or more characters. Did you mean '?' for exactly one character?`, vscode.DiagnosticSeverity.Information));
        }

        // 3.6 Short Root Wildcards
        const shortRootRegex = /\b[a-zA-Z]{1,2}\*/g;
        while ((match = shortRootRegex.exec(text)) !== null) {
            const range = new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(range, `Wildcard on a short root (1-2 letters) can cause severe performance issues or engine timeouts.`, vscode.DiagnosticSeverity.Warning));
        }

        // 3.7 Operator Collisions
        const collisionRegex = /\b[a-zA-Z0-9]+[\*\?%~]{2,}/g;
        while ((match = collisionRegex.exec(text)) !== null) {
            const range = new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(range, `Multiple search modifiers combined on a single term. dtSearch cannot process fuzzy/stemming/wildcards simultaneously on the same word.`, vscode.DiagnosticSeverity.Error));
        }

        // 4. Proximity inside OR clause
        const groupRegex = /\([^()]+\)/g; // matches innermost parenthesis groups
        while ((match = groupRegex.exec(text)) !== null) {
            const groupText = match[0].toUpperCase();
            if (/\bOR\b/.test(groupText) && /\b(?:W|PRE)\/\d+\b/.test(groupText)) {
                const proxMatch = /\b(?:W|PRE)\/\d+\b/.exec(groupText);
                if (proxMatch) {
                    const index = match.index + proxMatch.index;
                    const range = new vscode.Range(lineNum, index, lineNum, index + proxMatch[0].length);
                    diagnostics.push(new vscode.Diagnostic(range, `Proximity operator mixed with OR inside parentheses. Use nested parentheses to clarify logic.`, vscode.DiagnosticSeverity.Error));
                }
            }
        }

        // 4.5 Proximity mixed with OR at root level
        let rootLevelText = text;
        while (/\([^()]+\)/.test(rootLevelText)) {
            rootLevelText = rootLevelText.replace(/\([^()]+\)/g, (m) => ' '.repeat(m.length));
        }
        const rootUpper = rootLevelText.toUpperCase();
        if (/\bOR\b/.test(rootUpper) && /\b(?:W|PRE)\/\d+\b/.test(rootUpper)) {
            const proxMatch = /\b(?:W|PRE)\/\d+\b/.exec(rootUpper);
            if (proxMatch) {
                const index = proxMatch.index;
                const range = new vscode.Range(lineNum, index, lineNum, index + proxMatch[0].length);
                diagnostics.push(new vscode.Diagnostic(range, `Proximity operator mixed with OR at the root level. Use parentheses to clarify logic.`, vscode.DiagnosticSeverity.Error));
            }
        }

        // 5. Default Noise Words
        const noiseWords = new Set(['a', 'about', 'after', 'all', 'also', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can', 'come', 'could', 'did', 'do', 'each', 'even', 'for', 'from', 'further', 'furthermore', 'get', 'got', 'had', 'has', 'have', 'he', 'her', 'here', 'hi', 'him', 'himself', 'his', 'how', 'however', 'i', 'if', 'in', 'indeed', 'into', 'is', 'it', 'its', 'just', 'like', 'made', 'many', 'me', 'might', 'more', 'moreover', 'most', 'much', 'must', 'my', 'never', 'not', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over', 'said', 'same', 'see', 'she', 'should', 'since', 'some', 'still', 'such', 'take', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'therefore', 'these', 'they', 'this', 'those', 'through', 'thus', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'will', 'with', 'would', 'you', 'your']);
        const wordRegex = /\b[a-zA-Z]+\b/g;
        while ((match = wordRegex.exec(text)) !== null) {
            const word = match[0].toLowerCase();
            if (noiseWords.has(word) && !['and', 'or', 'not', 'w', 'pre'].includes(word)) {
                const range = new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length);
                diagnostics.push(new vscode.Diagnostic(range, `Noise word '${word}' may be ignored by the engine.`, vscode.DiagnosticSeverity.Information));
            }
        }
    }

    collection.set(document.uri, diagnostics);
}
