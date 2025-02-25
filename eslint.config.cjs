const airbnb = require('eslint-config-airbnb');

module.exports = [
  {
    rules: {
      ...airbnb.rules,
      'no-console': 'warn', // Explicitly enable the rule
    },
  },
];