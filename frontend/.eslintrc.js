module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@next/next/no-img-element': 'warn', // Downgrade from error to warning
    'react/no-unescaped-entities': 'off', // Turn off unescaped entities rule
  },
}