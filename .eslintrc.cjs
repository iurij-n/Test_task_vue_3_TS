// module.exports = {
//     root: true,
//     env: {
//         browser: true,
//         es2021: true
//     },
//     parser: "vue-eslint-parser",
//     parserOptions: {
//         parser: "@typescript-eslint/parser",
//         ecmaVersion: 2021,
//         sourceType: "module"
//     },
//     extends: [
//         "eslint:recommended",
//         "plugin:vue/vue3-recommended",
//         "plugin:@typescript-eslint/recommended",
//         "plugin:prettier/recommended"
//     ]
// }

module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    plugins: ['vue', '@typescript-eslint'],
    rules: {
        'indent': ['error', 4],
        'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }], // удаляет лишние пустые строки
        'vue/max-attributes-per-line': ['error', { 
            singleline: 5, 
            multiline: { max: 1, allowFirstLine: true } 
        }],
        'vue/html-closing-bracket-newline': ['error', {
            singleline: 'never',
            multiline: 'never'
        }],
    },
};