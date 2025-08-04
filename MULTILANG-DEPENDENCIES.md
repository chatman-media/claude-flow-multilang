# Multilingual Dependencies (Optional)

The multilingual features of Claude Flow are optional. If you want to enable full multilingual support, you can install these additional dependencies:

## Optional i18n Dependencies

```bash
# For full multilingual support (optional)
npm install --save-optional \
  i18next@^23.7.0 \
  i18next-fs-backend@^2.3.0 \
  accept-language-parser@^1.5.0 \
  node-polyglot@^2.5.0

# For documentation synchronization (optional)
npm install --save-optional \
  unified@^11.0.0 \
  remark@^15.0.0 \
  remark-parse@^11.0.0 \
  remark-stringify@^11.0.0
```

## Using Without Multilingual Features

The framework works perfectly without these dependencies. You can:

1. Use English-only mode
2. Implement your own i18n solution
3. Add multilingual support later when needed

## Minimal Installation

For minimal installation without conflicts:

```bash
# Install core dependencies only
npm install --production

# Or with legacy peer deps if needed
npm install --legacy-peer-deps
```

## TypeScript Types

The TypeScript types for multilingual features are already included in the source code and will work even without the runtime dependencies installed.