# eDiscovery dtSearch Toolkit

**eDiscovery dtSearch Toolkit** is a powerful Visual Studio Code extension designed for legal tech professionals, eDiscovery analysts, and developers working with dtSearch queries. It provides real-time linting, syntax highlighting, and intelligent logic refactoring to streamline the process of building and validating search strings.

## Features

- **Syntax Highlighting & Snippets**: Rich syntax coloring and helpful auto-complete snippets for `.dt`, `.dt1`, and `.dtsearch` files to make reading and writing complex queries effortless.
- **Real-Time Linting**: Instantly identifies syntax errors, unbalanced parentheses, and invalid proximity configurations as you type.
- **Query Cleaning**:
  - Automatically normalizes and cleans messy query syntax.
  - Fixes wildcard formatting, strips unnecessary whitespaces, and resolves quotation mismatches seamlessly.
- **Logic Refactoring & Expansion**:
  - Automatically parses and expands complex Boolean logic into simplified base searches.

## Usage & Commands

You can access the toolkit's powerful features via the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) or by **right-clicking** inside the editor:

* **dtSearch: Clean (In-Place)**: Cleans and standardizes the current query in the active editor.
* **dtSearch: Clean (New Tab)**: Outputs the cleaned query into a fresh, new editor tab.
* **dtSearch: Clean (Append)**: Appends the cleaned query to the end of your current file.
* **dtSearch: Expand Logic (New Tab)**: Expands the logic of the current query and outputs the Cartesian expansion to a new editor tab.
* **dtSearch: Expand Logic (Append)**: Appends the expanded logical statements directly below the current query.

## Getting Started

1. Create a new file and save it with the `.dt`, `.dt1`, or `.dtsearch` file extension.
2. The extension will automatically activate, providing syntax highlighting and real-time validation.
3. Start typing your dtSearch queries and use the context menu to instantly clean or expand your searches!

## Contributing

Contributions, bug reports, and feature requests are welcome! Feel free to open an issue or submit a pull request on GitHub.
