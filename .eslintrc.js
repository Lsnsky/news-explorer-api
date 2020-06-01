module.exports = {
  // Настройка для бэкенда
  extends: 'airbnb-base',
  rules: {
    'no-underscore-dangle': [2, { allow: ['_id'] }],
    'eslint-disable-line': 'off',
    'eslint-disable-next-line': 'off',
    'eslint-disable': 'off',
  },
};
