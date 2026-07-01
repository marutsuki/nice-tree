# bamboo-tree

![npm version](https://img.shields.io/npm/v/bamboo-tree.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

bamboo-tree is a small CLI tool that turns a directory into a polished, browsable HTML index page. It is useful for publishing a directory listing as a simple static site without needing a full web server or CMS.

A live example is available at https://bucket.marutsuki.com.

## Quick start

### Requirements

- Node.js 18 or newer
- npm

### Run it

Install the package globally or use it with `npx`:

```bash
npx bamboo-tree --root ./my-folder --output ./index.html
```

Useful options:

```bash
npx bamboo-tree --root ./my-folder --name "My Project" --output ./index.html --exclude .git,node_modules
```

Options:

- `--root <root>`: directory to scan
- `--name <name>`: title shown in the generated page
- `--output <output>`: output HTML file path
- `--exclude <exclude>`: comma-separated list of files/directories to skip (defaults to `.git`)

## Development setup

If you want to work on the project locally:

```bash
git clone https://github.com/marutsuki/bamboo-tree.git
cd bamboo-tree
npm install
npm run build
npm test
```

### Project structure

- `src/cli.ts` — command-line entrypoint
- `src/index.ts` — public API for generating the tree
- `src/tree.ts` — directory traversal and exclusion logic
- `src/template.ts` — HTML rendering via EJS
- `templates/index.ejs` — the page template

## Contributing

Contributions are welcome. If you make changes, please run the test suite and build before opening a pull request.

```bash
npm run build
npm test
```
