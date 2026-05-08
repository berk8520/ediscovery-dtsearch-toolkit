export type ASTNode =
    | { type: 'Term'; value: string }
    | { type: 'Binary'; operator: string; left: ASTNode; right: ASTNode }
    | { type: 'Unary'; operator: string; right: ASTNode }
    | { type: 'Group'; child: ASTNode };
