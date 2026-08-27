const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const tsdoc = require('eslint-plugin-tsdoc');
const importPlugin = require('eslint-plugin-import');
const preferArrow = require('eslint-plugin-prefer-arrow');

const SOURCES = ['src/**/*.ts'];

/** Scope a shared config (or array of them) to this project's source files. */
const scoped = (configs) => [].concat(configs).map((config) => ({ ...config, files: SOURCES }));

module.exports = [
    {
        ignores: [
            'build/**',
            'dist/**',
            'public/**',
            'coverage/**',
            'docs-src/**',
        ],
    },
    ...scoped(js.configs.recommended),
    ...scoped(tseslint.configs['flat/recommended']),
    {
        files: SOURCES,
        languageOptions: {
            parser: tsparser,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                sourceType: 'module',
                allowImportExportEverywhere: false,
                ecmaFeatures: {
                    globalReturn: false,
                },
                project: './tsconfig-prod.json',
            },
        },
        plugins: {
            'tsdoc': tsdoc,
            'import': importPlugin,
            'prefer-arrow': preferArrow,
            '@typescript-eslint': tseslint,
        },
        rules: {
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/array-type': [
                'error',
                {
                    default: 'array',
                },
            ],
            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/dot-notation': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'variable',
                    format: [
                        'camelCase',
                        'UPPER_CASE',
                        'PascalCase',
                    ],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'forbid',
                },
            ],
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/no-empty-interface': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-namespace': 'error',
            '@typescript-eslint/no-shadow': [
                'error',
                {
                    hoist: 'all',
                },
            ],
            '@typescript-eslint/no-unused-expressions': 'error',
            // Unused function parameters and catch bindings are intentional here:
            // they document overridable/optional API surface.
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'none',
                    caughtErrors: 'none',
                },
            ],
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            '@typescript-eslint/triple-slash-reference': [
                'error',
                {
                    path: 'always',
                    types: 'prefer-import',
                    lib: 'always',
                },
            ],
            '@typescript-eslint/typedef': 'off',
            '@typescript-eslint/unified-signatures': 'error',
            'complexity': 'off',
            'constructor-super': 'error',
            'dot-notation': 'off',
            'eqeqeq': [
                'error',
                'always',
            ],
            'guard-for-in': 'error',
            'id-denylist': [
                'error',
                'any',
                'Number',
                'number',
                'String',
                'string',
                'Boolean',
                'boolean',
                'Undefined',
                'undefined',
            ],
            'id-match': 'error',
            'import/order': [
                'off',
                {
                    alphabetize: {
                        caseInsensitive: true,
                        order: 'asc',
                    },
                    'newlines-between': 'ignore',
                    groups: [
                        [
                            'builtin',
                            'external',
                            'internal',
                            'unknown',
                            'object',
                            'type',
                        ],
                        'parent',
                        [
                            'sibling',
                            'index',
                        ],
                    ],
                    distinctGroup: false,
                    pathGroupsExcludedImportTypes: [],
                    pathGroups: [
                        {
                            pattern: './',
                            patternOptions: { nocomment: true, dot: true },
                            group: 'sibling',
                            position: 'before',
                        },
                        {
                            pattern: '.',
                            patternOptions: { nocomment: true, dot: true },
                            group: 'sibling',
                            position: 'before',
                        },
                        {
                            pattern: '..',
                            patternOptions: { nocomment: true, dot: true },
                            group: 'parent',
                            position: 'before',
                        },
                        {
                            pattern: '../',
                            patternOptions: { nocomment: true, dot: true },
                            group: 'parent',
                            position: 'before',
                        },
                    ],
                },
            ],
            'indent': 'off',
            'linebreak-style': [
                'error',
                'unix',
            ],
            'max-classes-per-file': [
                'error',
                1,
            ],
            'new-parens': 'error',
            'no-bitwise': 'error',
            'no-caller': 'error',
            'no-cond-assign': 'error',
            'no-console': 'error',
            'no-debugger': 'error',
            'no-empty': 'error',
            'no-empty-function': 'off',
            'no-eval': 'error',
            'no-fallthrough': 'error',
            'no-invalid-this': 'off',
            'no-new-wrappers': 'error',
            'no-shadow': 'off',
            'no-throw-literal': 'error',
            'no-trailing-spaces': 'error',
            'no-undef-init': 'error',
            'no-underscore-dangle': 'off',
            'no-unsafe-finally': 'error',
            'no-unused-expressions': 'off',
            'no-unused-labels': 'error',
            'no-use-before-define': 'off',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-arrow/prefer-arrow-functions': 'error',
            'prefer-const': 'error',
            'quotes': 'off',
            'radix': 'error',
            'spaced-comment': [
                'error',
                'always',
                {
                    markers: ['/'],
                },
            ],
            'tsdoc/syntax': 'warn',
            'use-isnan': 'error',
            'valid-typeof': 'off',
        },
    },
];
