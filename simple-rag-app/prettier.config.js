//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  useTabs: false,
  insertPragma: false,
  requirePragma: false,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
