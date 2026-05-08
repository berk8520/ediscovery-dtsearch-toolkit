import { ASTNode } from './ast';

function wrap(str: string): string {
    // Only wrap if the expanded string contains an operator that might cause precedence issues
    if (/\b(?:AND|NOT|W\/\d+|PRE\/\d+)\b/i.test(str)) {
        return `(${str})`;
    }
    return str;
}

export function expandAST(node: ASTNode | null): string[] {
    if (!node) return [];

    switch (node.type) {
        case 'Term':
            return [node.value];
        
        case 'Group':
            // Expand the child. No outer parens needed for the list of ORs.
            // Inner parts will be wrapped by the Binary case if needed.
            return expandAST(node.child);

        case 'Unary':
            if (node.operator === 'NOT') {
                const rights = expandAST(node.right);
                if (rights.length > 1) {
                    return [rights.map(r => `NOT (${r})`).join(' AND ')];
                }
                return [`NOT ${wrap(rights[0])}`];
            }
            return [];

        case 'Binary':
            const lefts = expandAST(node.left);
            const rights = expandAST(node.right);

            if (node.operator === 'OR') {
                return [...lefts, ...rights];
            } else {
                // Cartesian product for AND, W/N, PRE/N
                const result: string[] = [];
                for (const l of lefts) {
                    for (const r of rights) {
                        const lStr = wrap(l);
                        const rStr = wrap(r);
                        result.push(`${lStr} ${node.operator} ${rStr}`);
                    }
                }
                return result;
            }
    }
}
