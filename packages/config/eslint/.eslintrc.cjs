module.export = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'airbnb',
    'standard',
    'standard-react',
    'prettier',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    'dot-notation': 0,
    'consistent-return': [0],
    'comma-dangle': [0],
    'arrow-body-style': [0],
    strict: [0],
    indent: ['off', 2, { SwitchCase: 1 }],
    // "linebreak-style": ["error", "windows"],
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    quotes: ['error', 'single'],
    eqeqeq: 'warn',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-console': 'warn',

    'no-underscore-dangle': [0],
    'no-useless-escape': [0],
    'no-use-before-define': [0],
    'no-trailing-spaces': [
      'error',
      {
        skipBlankLines: true
      }
    ],
    'no-useless-constructor': [0],
    'no-debugger': [2],
    'no-nested-ternary': [0],
    'no-only-tests/no-only-tests': [0],
    'no-unused-expressions': [0],
    'no-restricted-syntax': [0],

    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx']
      }
    ],
    'react/jsx-first-prop-new-line': [0],
    'react/prop-types': [0],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function'
      }
    ],
    'react/jsx-indent-props': [0],
    'react/forbid-prop-types': [0],
    'react/jsx-props-no-spreading': [0],
    'react/jsx-indent': [2, 2],
    'react/destructuring-assignment': [1],
    'react/default-props-match-prop-types': [1],
    'react/no-array-index-key': [0],
    'react/jsx-no-constructed-context-values': [0],
    'react/jsx-no-duplicate-props': [
      1,
      {
        ignoreCase: true
      }
    ],
    'react/jsx-no-undef': [1],
    'react/jsx-pascal-case': [
      1,
      {
        allowAllCaps: true,
        ignore: []
      }
    ],
    'react/jsx-uses-react': [1],
    'react/jsx-uses-vars': [1],
    'react/no-deprecated': [1],
    'react/no-direct-mutation-state': [2],
    'react/no-is-mounted': [1],
    'react/require-default-props': [0],
    'react/no-multi-comp': [
      1,
      {
        ignoreStateless: true
      }
    ],
    'react/no-unused-prop-types': [1],
    'react/react-in-jsx-scope': [1],
    'react/require-render-return': [1],
    'react-hooks/rules-of-hooks': [2],
    'react-hooks/exhaustive-deps': [0],

    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/interactive-supports-focus': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [1],
    'jsx-a11y/no-static-element-interactions': [1],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to']
      }
    ],
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/label-has-associated-control': [0],

    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': [
      0,
      {
        ignore: ['Components']
      }
    ],
    'import/no-cycle': 'off',
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'import/prefer-default-export': [0],
    'import/named': 0,
    'no-restricted-exports': [0, { restrictedNamedExports: ['default'] }],

    'prettier/prettier': [
      2,
      {
        printWidth: 100,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'none',
        semi: true,
        useTabs: false,
        jsxBracketSameLine: true,
        arrowParens: 'avoid',
        bracketSpacing: true
      }
    ]
  }
}
