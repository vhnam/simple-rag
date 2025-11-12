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
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrder: [
    '^react$',
    '^react-dom$',
    '^@tanstack/(.*)$',
    '^@radix-ui/(.*)$',
    '^@fontsource/(.*)$',
    '^@(?![/])',
    '^[^@./]',
    '^@/constants/(.*)$',
    '^@/schemas/(.*)$',
    '^@/integrations/(.*)$',
    '^@/hooks/(.*)$',
    '^@/lib/(.*)$',
    '^@/queries/(.*)$',
    '^@/stores/(.*)$',
    '^@/routes/(.*)$',
    '^@/layouts/(.*)$',
    '^@/components/(.*)$',
    '^@/modules/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
