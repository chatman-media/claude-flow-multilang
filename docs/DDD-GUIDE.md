# 🏗️ Domain-Driven Design (DDD) Guide

## Complete DDD Integration in Claude Flow Multilang

This guide explains how Domain-Driven Design is fully integrated into the Claude Flow Multilang development workflow.

## 📚 Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Command Architecture](#command-architecture)
- [Development Workflow](#development-workflow)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Overview

Claude Flow Multilang provides comprehensive DDD support with:

- **Command/Query Separation (CQRS)** - Full command bus implementation
- **Event Sourcing** - Domain events with multilingual support
- **Bounded Contexts** - Isolated domain boundaries
- **Aggregates & Entities** - Rich domain models
- **Value Objects** - Immutable domain concepts
- **Repository Pattern** - Abstracted persistence
- **Domain Services** - Complex business logic

## Core Concepts

### Commands and Handlers

Commands represent intentions to change the system state:

```typescript
// Define a command
interface ICreateProductCommand extends ICommand {
  name: Partial<Record<SupportedLanguage, string>>;
  description: Partial<Record<SupportedLanguage, string>>;
  price: number;
  inventory: number;
  category: string;
}

// Implement a handler
class CreateProductHandler extends CommandHandler<ICreateProductCommand, Product> {
  async handle(command: ICreateProductCommand): Promise<ICommandResult<Product>> {
    // Validate command
    // Create aggregate
    // Apply business rules
    // Publish events
    // Persist to repository
    return this.successResult(product, product.id, ['ProductCreated']);
  }
}
```

### Command Bus

The command bus routes commands to appropriate handlers:

```typescript
const commandBus = new CommandBus(logger);

// Register handlers
commandBus.register('CreateProduct', createProductHandler);
commandBus.register('UpdateProduct', updateProductHandler);

// Execute commands
const result = await commandBus.execute(createCommand);
```

### DDD Development Service

The `DDDDevelopmentService` integrates DDD into your development workflow:

```typescript
const dddService = new DDDDevelopmentService(logger, polyglotAgent);

// Start DDD development
const workflow = await dddService.startDevelopment(
  { en: 'E-Commerce Platform' },
  { en: 'Modern e-commerce with DDD' },
  { methodology: 'event-storming' }
);

// Create bounded contexts
const catalogContext = await dddService.createBoundedContext(
  { en: 'Product Catalog', ru: 'Каталог продуктов' },
  { en: 'Manages products and inventory' }
);

// Add aggregates
await dddService.addAggregate(catalogContext.id, productAggregate);

// Generate code
const files = await dddService.generateCode(catalogContext.id, {
  language: 'typescript',
  includeTests: true,
  includeRepositories: true
});
```

## Command Architecture

### Command Flow

```
User Input → Command → CommandBus → Handler → Aggregate → Repository → Events
```

### Command Types

1. **Create Commands** - Create new aggregates
2. **Update Commands** - Modify existing aggregates
3. **Delete Commands** - Remove aggregates
4. **Query Commands** - Read-only operations

### Command Results

Every command returns a result with:

```typescript
interface ICommandResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  aggregateId?: string;
  version?: number;
  events?: string[];
}
```

## Development Workflow

### 1. Discovery Phase

Start with Event Storming to discover domain concepts:

```typescript
await dddService.startDevelopment(
  projectName,
  description,
  { methodology: 'event-storming' }
);
```

### 2. Modeling Phase

Define bounded contexts and aggregates:

```typescript
// Create bounded context
const context = await dddService.createBoundedContext(name, description);

// Define aggregate
const aggregate = {
  name: new MultilingualString({ en: 'Product' }),
  properties: [...],
  methods: [...],
  events: ['ProductCreated', 'PriceUpdated'],
  invariants: ['Price must be positive']
};

await dddService.addAggregate(context.id, aggregate);
```

### 3. Implementation Phase

Generate code from domain models:

```typescript
const files = await dddService.generateCode(context.id, {
  language: 'typescript',
  includeTests: true,
  includeRepositories: true,
  includeServices: true
});
```

### 4. Command Execution

Execute commands through the service:

```typescript
// Single command
const result = await dddService.executeCommand(createProductCommand);

// Command sequence (transactional)
const results = await dddService.executeCommandSequence([
  createProductCommand,
  updateInventoryCommand,
  publishProductCommand
]);
```

## Examples

### Example 1: E-Commerce Product Management

```typescript
// 1. Register handlers
dddService.registerCommandHandler('CreateProduct', createProductHandler);
dddService.registerCommandHandler('UpdateProduct', updateProductHandler);

// 2. Create product
const createCommand: ICreateProductCommand = {
  type: 'CreateProduct',
  id: 'cmd-001',
  timestamp: new Date(),
  language: SupportedLanguage.EN,
  name: {
    en: 'MacBook Pro',
    ru: 'MacBook Pro',
    ja: 'MacBook Pro',
    zh_cn: 'MacBook Pro'
  },
  price: 1999,
  inventory: 50,
  category: 'electronics'
};

const result = await dddService.executeCommand(createCommand);

// 3. Update product
if (result.success) {
  const updateCommand: IUpdateProductCommand = {
    type: 'UpdateProduct',
    productId: result.aggregateId,
    updates: {
      price: 1799,
      inventory: { quantity: -5, reason: 'Sold 5 units' }
    }
  };
  
  await dddService.executeCommand(updateCommand);
}
```

### Example 2: Complete DDD Workflow

```typescript
// Run the complete DDD development workflow
import { runDDDDevelopmentWorkflow } from './examples/ddd-development-example';

await runDDDDevelopmentWorkflow();
// This will:
// - Initialize DDD service
// - Create bounded contexts
// - Design aggregates
// - Validate domain model
// - Generate code
// - Show multilingual documentation
```

### Example 3: Command Patterns

```typescript
// Run command pattern examples
import { runDDDCommandsExample } from './examples/ddd-commands-example';

await runDDDCommandsExample();
// This demonstrates:
// - Command creation and execution
// - Handler registration
// - Repository pattern
// - Command sequences
// - Query operations
```

## Best Practices

### 1. Command Design

- Keep commands immutable
- Include all necessary data
- Use multilingual strings for user-facing content
- Add metadata (timestamp, userId, language)

### 2. Handler Implementation

- Validate input thoroughly
- Use transactions for consistency
- Publish domain events
- Return detailed results
- Handle errors gracefully

### 3. Aggregate Design

- Keep aggregates small and focused
- Enforce invariants strictly
- Use value objects for concepts
- Emit domain events for state changes
- Support multilingual properties

### 4. Repository Pattern

```typescript
interface IProductRepository extends IMultilingualRepository<Product> {
  findByCategory(category: string): Promise<Product[]>;
  findByPriceRange(min: number, max: number): Promise<Product[]>;
  search(query: string, language: SupportedLanguage): Promise<Product[]>;
}
```

### 5. Testing

- Unit test command handlers
- Test aggregate invariants
- Verify event emission
- Test command sequences
- Validate multilingual support

## Integration with Claude Flow Features

### Swarm Coordination

DDD integrates with swarm coordination:

```typescript
// Spawn specialized DDD agents
Task("Domain Expert", "Analyze business requirements", "researcher");
Task("Architect", "Design aggregates", "system-architect");
Task("Developer", "Implement domain models", "coder");
Task("Tester", "Test invariants", "tester");
```

### Memory System

DDD decisions are stored in memory:

```typescript
mcp__claude-flow__memory_usage({
  action: 'store',
  key: 'ddd/bounded-context/catalog',
  value: boundedContextDefinition
});
```

### Neural Learning

The system learns from DDD patterns:

```typescript
mcp__claude-flow__neural_train({
  patterns: aggregatePatterns,
  modelId: 'ddd-optimizer'
});
```

## Running Examples

```bash
# Run DDD development workflow
npm run example:ddd

# Run command pattern examples
npm run example:commands

# Run multilingual workflow
npm run example:multilang
```

## Troubleshooting

### Common Issues

1. **Commands not executing**: Ensure handlers are registered
2. **Validation failures**: Check command structure
3. **Repository errors**: Verify repository implementation
4. **Event publishing**: Ensure event bus is configured

### Debug Mode

Enable debug logging:

```typescript
const logger = new ConsoleLogger('ddd-debug');
const dddService = new DDDDevelopmentService(logger, agent);
```

## Summary

Claude Flow Multilang provides complete DDD integration with:

- ✅ Full command/handler architecture
- ✅ Command bus with routing
- ✅ Bounded context management
- ✅ Aggregate design and code generation
- ✅ Repository pattern implementation
- ✅ Event sourcing support
- ✅ Multilingual domain models
- ✅ Integration with development workflow

The DDD implementation is production-ready and fully integrated into the development process, allowing you to build complex domain-driven applications with multilingual support.