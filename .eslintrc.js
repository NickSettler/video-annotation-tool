module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  root: true,
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    camelcase: 'error',
    'spaced-comment': 'error',
    quotes: ['error', 'single'],
    'no-duplicate-imports': 'error',
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      { ts: 'never', tsx: 'never' },
    ],
    'no-shadow': 'off',
    'max-len': ['warn', { code: 120, ignoreComments: true, ignoreUrls: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'lines-between-class-members': ['error', 'always'],
    'no-unused-vars': 'off',

    // React rules
    'react/boolean-prop-naming': [
      'error',
      { propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'] },
    ],
    'react/button-has-type': [
      'error',
      {
        button: true,
        submit: true,
        reset: true,
      },
    ],
    'react/destructuring-assignment': ['error', 'always'],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/hook-use-state': ['error', { allowDestructuredState: true }],
    'react/jsx-boolean-value': ['error', 'never'],

    // TypeScript rules
    '@typescript-eslint/array-type': ['error', { default: 'generic' }],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'no-public',
          methods: 'explicit',
          properties: 'off',
          parameterProperties: 'explicit',
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/method-signature-style': ['error', 'method'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'enum',
        format: ['UPPER_CASE'],
        prefix: ['E_'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        prefix: ['T'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
    ],
    '@typescript-eslint/no-confusing-void-expression': [
      'error',
      {
        ignoreArrowShorthand: true,
      },
    ],
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-arguments': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-useless-empty-export': 'error',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/parameter-properties': [
      'error',
      {
        prefer: 'parameter-property',
      },
    ],
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/sort-type-constituents': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
