module.exports = exports = {
    parser:  '@typescript-eslint/parser',
    plugins: ["@typescript-eslint"],
    extends:  [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType:  'module'
    },
    env: {
        browser: true,
        es6: true
    },
    rules: {
        indent: ["error", 4],
        "comma-style": ["error", "last"],
        "space-before-blocks": ["error", "never"],
        semi: [2, "never"]
    }
}