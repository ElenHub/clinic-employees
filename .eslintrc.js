module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    rules: {
        'react/react-in-jsx-scope': 'off' 
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};