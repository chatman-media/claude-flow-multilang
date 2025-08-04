# Migration Guide: Claude Flow → Claude Flow Multilang

## 🔄 Package Name Change

The package has been renamed from `claude-flow` to `claude-flow-multilang` to reflect its revolutionary multilingual capabilities.

### Old Package
```bash
npm install -g claude-flow@alpha
npx claude-flow@alpha init
```

### New Package
```bash
npm install -g claude-flow-multilang@latest
npx claude-flow-multilang@latest init
```

## 📦 Installation Changes

### Global Installation
```bash
# Remove old package
npm uninstall -g claude-flow

# Install new multilingual package
npm install -g claude-flow-multilang@latest
```

### Project Installation
```bash
# Update package.json
npm uninstall claude-flow
npm install claude-flow-multilang@latest
```

## 🔧 Command Changes

### Basic Commands
| Old Command | New Command |
|------------|-------------|
| `npx claude-flow@alpha init` | `npx claude-flow-multilang@latest init` |
| `npx claude-flow@alpha swarm` | `npx claude-flow-multilang@latest swarm` |
| `npx claude-flow@alpha hive-mind` | `npx claude-flow-multilang@latest hive-mind` |
| `claude-flow sparc` | `claude-flow-multilang sparc` |

### New DDD Commands
```bash
# New DDD-SPARC CLI tool
npx ddd-sparc init "MyProject" --languages en,ru,zh-cn
npx ddd-sparc context create "ordering" --language en
npx ddd-sparc aggregate add "Order" --context ordering
npx ddd-sparc generate --all --multilingual
```

## 🌍 New Multilingual Features

### Language Configuration
```javascript
// Old (English only)
const flow = new ClaudeFlow();

// New (Multilingual)
const flow = new ClaudeFlow({
  languages: ['en', 'ru', 'zh-cn', 'ja'],
  primaryLanguage: 'en',
  culturalContext: true
});
```

### Polyglot Agents
```javascript
// New polyglot agent capabilities
const agent = new PolyglotAgent({
  name: 'GlobalAssistant',
  languages: ['en', 'ru', 'zh-cn'],
  culturalAwareness: true
});

// Process in any language
await agent.process("создать заказ"); // Russian
await agent.process("创建订单"); // Chinese
```

## 🏗️ DDD Integration

### Enable DDD
```bash
# Initialize with DDD
claude-flow-multilang init --ddd --multilingual

# Or configure in existing project
claude-flow-multilang config set ddd true
claude-flow-multilang config set multilingual true
```

### Disable DDD (for simple projects)
```bash
# Initialize without DDD
claude-flow-multilang init --no-ddd

# Or in config
echo '{"features": {"ddd": false}}' > .claude/config.json
```

## 📝 Configuration File Changes

### Old Configuration (.claude/config.json)
```json
{
  "version": "2.0.0",
  "features": {
    "sparc": true,
    "swarm": true
  }
}
```

### New Configuration
```json
{
  "version": "3.0.0",
  "features": {
    "sparc": true,
    "swarm": true,
    "multilingual": true,
    "ddd": true
  },
  "languages": {
    "supported": ["en", "ru", "zh-cn", "ja"],
    "primary": "en"
  },
  "culturalContext": {
    "enabled": true,
    "formalityLevel": "auto"
  }
}
```

## 🚀 Import Changes

### JavaScript/TypeScript
```javascript
// Old
import { ClaudeFlow } from 'claude-flow';

// New
import { ClaudeFlow, PolyglotAgent, MultilingualAggregate } from 'claude-flow-multilang';
```

### CommonJS
```javascript
// Old
const { ClaudeFlow } = require('claude-flow');

// New
const { ClaudeFlow, PolyglotAgent } = require('claude-flow-multilang');
```

## 🎯 Feature Flags

### Opt-out of New Features
If you don't need multilingual or DDD features:

```javascript
const flow = new ClaudeFlow({
  features: {
    multilingual: false, // Disable multilingual
    ddd: false          // Disable DDD
  }
});
```

## 📊 Supported Languages

The following 14 languages are now natively supported:
- English (EN)
- Russian (RU)
- Chinese Simplified (ZH-CN)
- Chinese Traditional (ZH-TW)
- Japanese (JA)
- Korean (KO)
- German (DE)
- French (FR)
- Spanish (ES)
- Portuguese (PT)
- Turkish (TR)
- Thai (TH)
- Italian (IT)
- Hindi (HI)

## ⚠️ Breaking Changes

1. **Package name**: Must update all references from `claude-flow` to `claude-flow-multilang`
2. **Version**: Now v3.0.0 instead of v2.0.0
3. **Default features**: Multilingual and DDD are enabled by default (can be disabled)
4. **New dependencies**: Optional i18n packages (automatically skipped if not needed)

## 🔗 Repository Change

- **Old**: https://github.com/ruvnet/claude-code-flow
- **New**: https://github.com/chatman-media/claude-flow-multilang

## 📚 Documentation

- [README](./README.md) - Updated overview
- [INSTALLATION](./INSTALLATION.md) - Installation guide
- [CHANGELOG-MULTILANG](./CHANGELOG-MULTILANG.md) - Full changelog
- [Wiki](./claude-flow-wiki/) - Comprehensive documentation

## 💡 Need Help?

- GitHub Issues: https://github.com/chatman-media/claude-flow-multilang/issues
- Discord: https://discord.gg/claude-flow
- Documentation: https://github.com/chatman-media/claude-flow-multilang/wiki

---

**Claude Flow Multilang v3.0.0** - Breaking Language Barriers in AI Development 🌍🤖