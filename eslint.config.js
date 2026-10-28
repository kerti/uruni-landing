import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.astro/'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  {
    // Node globals for config files and scripts.
    files: ['*.{js,mjs}', 'scripts/**'],
    languageOptions: { globals: globals.node },
  },
  {
    // eslint-plugin-astro v3 no longer wires a TS parser for component
    // frontmatter itself; point it at typescript-eslint's parser.
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
];
