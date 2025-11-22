module.exports = {
    tabWidth: 4,                   // 4 пробела
    useTabs: false,                 // пробелы вместо табов
    semi: true,
    singleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    jsxBracketSameLine: true,       // для JSX/TSX (Vue 3 тоже учитывает)
    htmlWhitespaceSensitivity: 'ignore', // важное для Vue
    endOfLine: 'lf',
    printWidth: 120,
    vueIndentScriptAndStyle: true,  // отступ в <script> и <style>
};
