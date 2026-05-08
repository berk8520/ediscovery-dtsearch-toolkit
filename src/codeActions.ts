import * as vscode from 'vscode';

export class DtSearchCodeActionProvider implements vscode.CodeActionProvider {
    provideCodeActions(
        document: vscode.TextDocument, 
        range: vscode.Range, 
        context: vscode.CodeActionContext, 
        token: vscode.CancellationToken
    ): vscode.CodeAction[] {
        const actions: vscode.CodeAction[] = [];

        for (const diagnostic of context.diagnostics) {
            const text = document.getText(diagnostic.range).toUpperCase();

            if (text.includes('NEAR')) {
                const numMatch = text.match(/\d+/);
                const num = numMatch ? numMatch[0] : '15'; // Default to 15 if no number provided
                actions.push(this.createFix(document, diagnostic.range, `Convert NEAR to W/${num}`, `W/${num}`));
            } else if (text === '/S') {
                actions.push(this.createFix(document, diagnostic.range, 'Convert /S to W/20', 'W/20'));
            } else if (text === '/P') {
                actions.push(this.createFix(document, diagnostic.range, 'Convert /P to W/50', 'W/50'));
            } else if (text === '!') {
                actions.push(this.createFix(document, diagnostic.range, 'Convert Lexis wildcard (!) to dtSearch (*)', '*'));
            } else if (text === 'AND') {
                actions.push(this.createFix(document, diagnostic.range, 'Delete dangling AND operator', ''));
            } else if (diagnostic.message.includes('Missing operator')) {
                const fixedSpace = text.replace(')(', ') AND (');
                actions.push(this.createFix(document, diagnostic.range, 'Insert AND', fixedSpace, true));
                actions.push(this.createFix(document, diagnostic.range, 'Insert OR', text.replace(')(', ') OR ('), false));
                actions.push(this.createFix(document, diagnostic.range, 'Insert W/10', text.replace(')(', ') W/10 ('), false));
            } else if (diagnostic.message.includes('Consecutive logical operators')) {
                const ops = text.split(/\s+/);
                if (ops.length >= 2) {
                    actions.push(this.createFix(document, diagnostic.range, `Keep '${ops[0]}'`, ops[0], true));
                    actions.push(this.createFix(document, diagnostic.range, `Keep '${ops[ops.length-1]}'`, ops[ops.length-1], false));
                }
            } else if (diagnostic.message.includes('Missing proximity number')) {
                actions.push(this.createFix(document, diagnostic.range, `Set to ${text}15`, `${text}15`, true));
            } else if (diagnostic.message.includes('Smart quotes found')) {
                const char = document.getText(diagnostic.range);
                const replacement = (char === '“' || char === '”') ? '"' : "'";
                actions.push(this.createFix(document, diagnostic.range, `Convert to standard quote`, replacement, true));
            } else if (diagnostic.message.includes('Unclosed quotation')) {
                actions.push(this.createFix(document, diagnostic.range, 'Delete stray quote', '', true));
            } else if (diagnostic.message.includes('Internal wildcard')) {
                actions.push(this.createFix(document, diagnostic.range, "Replace '*' with '?' (single character)", "?", true));
            } else if (diagnostic.message.includes('Unbalanced')) {
                actions.push(this.createFix(document, diagnostic.range, 'Delete stray parenthesis', ''));
            }
        }

        return actions;
    }

    private createFix(document: vscode.TextDocument, range: vscode.Range, title: string, replacement: string, isPreferred: boolean = true): vscode.CodeAction {
        const fix = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.replace(document.uri, range, replacement);
        // Mark this as the preferred fix for this error
        fix.isPreferred = isPreferred;
        return fix;
    }
}
