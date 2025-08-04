# 📦 Installation Guide

## Quick Start

### Basic Installation (Recommended)

```bash
# Install Claude Flow Multilang
npm install -g claude-flow-multilang@latest

# Or as dev dependency in your project
npm install --save-dev claude-flow-multilang@latest
```

### If You Have Dependency Conflicts

```bash
# Use legacy peer deps
npm install --legacy-peer-deps claude-flow-multilang@latest

# Or force install
npm install --force claude-flow-multilang@latest
```

## 🎯 Installation Options

### 1. Minimal Installation (No DDD, No Multilingual)

Perfect for Tauri, desktop apps, simple projects:

```bash
# Install core only
npm install claude-flow-multilang@latest --no-optional

# Configure without DDD
echo '{"features": {"ddd": false, "multilingual": false}}' > .claude/config.json
```

### 2. Standard Installation (With SPARC, No DDD)

For most web/desktop applications:

```bash
# Install standard
npm install claude-flow-multilang@latest

# Configure
npx claude-flow init --type standard --no-ddd
```

### 3. Full Installation (Everything)

For enterprise applications with DDD and multilingual:

```bash
# Install with all features
npm install claude-flow-multilang@latest

# Install optional multilingual dependencies
npm install i18next@^23 i18next-fs-backend@^2 accept-language-parser@^1

# Configure with DDD
npx claude-flow init --type enterprise --with-ddd --multilingual
```

## 🔧 Verify Installation

After installation, verify everything works:

```bash
# Check version
npx claude-flow --version

# Run tests
node test-framework.js

# Test example
npm run example:ddd
```

Expected output:
```
✅ 20/20 tests passed
✅ Framework ready to use
```

## 🚀 Using with Existing Projects

### For Tauri Desktop App

```bash
cd your-tauri-app/

# Install as dev dependency
npm install --save-dev claude-flow-multilang@latest

# Initialize without DDD
npx claude-flow init --existing --type tauri --no-ddd

# Use Tauri-specific features
npx claude-flow generate tauri-command
npx claude-flow analyze src-tauri/
```

### For React/Next.js App

```bash
cd your-react-app/

# Install
npm install --save-dev claude-flow-multilang@latest

# Initialize for React
npx claude-flow init --existing --type react

# Use React features
npx claude-flow generate component
npx claude-flow analyze src/components
```

### For Node.js API

```bash
cd your-api/

# Install
npm install --save-dev claude-flow-multilang@latest

# Initialize for API
npx claude-flow init --existing --type api

# Use API features
npx claude-flow generate endpoint
npx claude-flow analyze routes/
```

## ⚙️ Configuration

### Disable Features You Don't Need

`.claude/config.json`:
```json
{
  "features": {
    "ddd": false,          // Disable DDD for simple apps
    "multilingual": false, // Disable if English-only
    "sparc": true,        // Keep SPARC methodology
    "testing": true       // Keep testing features
  }
}
```

### Project Types

| Project Type | DDD? | Multilingual? | Config |
|-------------|------|---------------|--------|
| Tauri Desktop | ❌ | Optional | `--type tauri --no-ddd` |
| React SPA | ❌ | Optional | `--type react --no-ddd` |
| Simple API | ❌ | ❌ | `--type api --no-ddd` |
| E-commerce | ✅ | ✅ | `--type enterprise --with-ddd` |
| Enterprise | ✅ | ✅ | `--type enterprise --with-ddd` |

## 🆘 Troubleshooting

### Problem: Dependency conflicts

```bash
# Solution 1: Use legacy peer deps
npm install --legacy-peer-deps

# Solution 2: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Solution 3: Use yarn or pnpm
yarn install
# or
pnpm install
```

### Problem: "DDD is too complex"

```bash
# Disable DDD completely
npx claude-flow config set features.ddd false
```

### Problem: "I don't need multilingual"

```bash
# Disable multilingual features
npx claude-flow config set features.multilingual false
```

### Problem: Installation fails on Windows

```bash
# Use pnpm on Windows
pnpm install claude-flow-multilang@latest
```

## ✅ What's Included

### Core Features (Always Available)
- ✅ SPARC methodology
- ✅ Agent orchestration
- ✅ Code analysis
- ✅ Test generation
- ✅ Documentation generation
- ✅ Refactoring assistance

### Optional Features
- ⚙️ DDD (Domain-Driven Design) - Enable with `--with-ddd`
- ⚙️ Multilingual support - Enable with `--multilingual`
- ⚙️ Cultural context - Requires multilingual
- ⚙️ Event sourcing - Requires DDD

## 📊 Installation Success Checklist

- [ ] Package installed without errors
- [ ] `npx claude-flow --version` shows version
- [ ] `test-framework.js` passes all tests
- [ ] Example runs successfully
- [ ] Configuration file created
- [ ] Appropriate features enabled/disabled

## 🎯 Next Steps

After successful installation:

1. **Initialize your project**
   ```bash
   npx claude-flow init
   ```

2. **Analyze existing code**
   ```bash
   npx claude-flow analyze
   ```

3. **Generate improvements**
   ```bash
   npx claude-flow suggest
   ```

4. **Start using agents**
   ```bash
   npx claude-flow agent spawn coder
   ```

## 📚 Resources

- [Integration Guide](docs/INTEGRATION-GUIDE.md) - Using with existing projects
- [DDD Guide](docs/DDD-GUIDE.md) - Domain-Driven Design (if needed)
- [Examples](examples/) - Working examples
- [Test Script](test-framework.js) - Verify installation

## 💡 Tips

1. **Start simple** - Don't enable everything at once
2. **Use what you need** - Disable unused features
3. **Gradual adoption** - Integrate slowly into existing projects
4. **No DDD for simple apps** - It's overkill for most projects

---

**Remember:** You don't need to use all features! Start with the basics and add more as needed.