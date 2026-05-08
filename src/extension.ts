import * as vscode from 'vscode';
import { updateDiagnostics } from './diagnostics';
import { cleanText } from './cleaner';
import { DtSearchCodeActionProvider } from './codeActions';

let activeOutputEditor: vscode.TextEditor | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('eDiscovery dtSearch Toolkit is now active!');

    const diagnosticCollection = vscode.languages.createDiagnosticCollection('dtsearch');
    context.subscriptions.push(diagnosticCollection);

    function replaceSmartQuotes(document: vscode.TextDocument) {
        const text = document.getText();
        const smartQuoteRegex = /[“”‘’]/g;
        let match;
        const edit = new vscode.WorkspaceEdit();
        let hasEdits = false;

        while ((match = smartQuoteRegex.exec(text)) !== null) {
            const char = match[0];
            const replacement = (char === '“' || char === '”') ? '"' : "'";
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + 1);
            edit.replace(document.uri, new vscode.Range(startPos, endPos), replacement);
            hasEdits = true;
        }

        if (hasEdits) {
            vscode.workspace.applyEdit(edit);
        }
    }

    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
    }

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'dtsearch') {
            if (event.contentChanges.some(c => /[“”‘’]/.test(c.text))) {
                replaceSmartQuotes(event.document);
            }
            updateDiagnostics(event.document, diagnosticCollection);
        }
    }));

    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'dtsearch') {
            replaceSmartQuotes(document);
            updateDiagnostics(document, diagnosticCollection);
        }
    }));

    // Helper to append or create new tab
    async function outputToTab(text: string, forceNew: boolean) {
        if (forceNew || !activeOutputEditor || activeOutputEditor.document.isClosed) {
            const newDoc = await vscode.workspace.openTextDocument({
                content: text,
                language: 'dtsearch'
            });
            activeOutputEditor = await vscode.window.showTextDocument(newDoc, vscode.ViewColumn.Beside, true);
        } else {
            const lastLine = activeOutputEditor.document.lineAt(activeOutputEditor.document.lineCount - 1);
            await activeOutputEditor.edit(editBuilder => {
                editBuilder.insert(new vscode.Position(lastLine.lineNumber + 1, 0), '\n\n' + text);
            });
        }
    }

    function getSelectedTextOrError(editor: vscode.TextEditor): string | null {
        const text = editor.document.getText(editor.selection);
        if (!text.trim()) {
            vscode.window.showInformationMessage("Please highlight/select the dtSearch text you want to process first.");
            return null;
        }
        return text;
    }

    const cmdCleanInPlace = vscode.commands.registerCommand('dtsearch.cleanInPlace', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const text = getSelectedTextOrError(editor);
        if (!text) return;
        
        let cleaned = cleanText(text);
        if (text.endsWith('\r\n')) cleaned += '\r\n';
        else if (text.endsWith('\n')) cleaned += '\n';

        await editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, cleaned);
        });
    });

    const cmdCleanNew = vscode.commands.registerCommand('dtsearch.cleanNew', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const text = getSelectedTextOrError(editor);
        if (!text) return;
        
        await outputToTab(cleanText(text), true);
    });

    const cmdCleanAppend = vscode.commands.registerCommand('dtsearch.cleanAppend', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const text = getSelectedTextOrError(editor);
        if (!text) return;
        
        await outputToTab(cleanText(text), false);
    });

    function expandWorker(text: string, forceNew: boolean) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Expanding dtSearch logic...",
            cancellable: false
        }, async () => {
            return new Promise<void>((resolve, reject) => {
                const { Worker } = require('worker_threads');
                const path = require('path');
                const workerPath = path.join(__dirname, 'worker.js');
                const worker = new Worker(workerPath);

                worker.on('message', async (message: any) => {
                    if (message.success) {
                        await outputToTab(message.result.join('\n'), forceNew);
                        resolve();
                    } else {
                        vscode.window.showErrorMessage("Expansion failed: " + message.error);
                        reject();
                    }
                });

                worker.on('error', (err: any) => {
                    vscode.window.showErrorMessage("Worker error: " + err.message);
                    reject();
                });

                worker.postMessage(text);
            });
        });
    }

    const cmdExpandNew = vscode.commands.registerCommand('dtsearch.expandNew', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const text = getSelectedTextOrError(editor);
        if (!text) return;
        expandWorker(text, true);
    });

    const cmdExpandAppend = vscode.commands.registerCommand('dtsearch.expandAppend', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const text = getSelectedTextOrError(editor);
        if (!text) return;
        expandWorker(text, false);
    });

    const codeActionProvider = vscode.languages.registerCodeActionsProvider('dtsearch', new DtSearchCodeActionProvider(), {
        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
    });

    context.subscriptions.push(cmdCleanInPlace, cmdCleanNew, cmdCleanAppend, cmdExpandNew, cmdExpandAppend, codeActionProvider);
}

export function deactivate() {}
