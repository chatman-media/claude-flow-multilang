# Claude Code Configuration for Multilingual Domain-Driven Design (DDD)

## 🌍 Claude Flow Multilang Framework v3.0.0

**Revolutionary multilingual AI orchestration with cultural awareness and DDD architecture**

## 🏗️ CRITICAL: Multilingual Domain-Centric Parallel Execution

**MANDATORY RULE**: In multilingual DDD environments, ALL development activities MUST be domain-aligned, context-bounded, and culturally aware:

1. **Domain Modeling** → Initialize swarm with bounded context scope and language preferences
2. **Ubiquitous Language** → Batch ALL domain concepts in multiple languages
3. **Context Mapping** → Parallel execution across bounded contexts with translation
4. **Aggregate Design** → Batch ALL entity and value object creation with i18n support
5. **Cultural Context** → Apply business etiquette and formality levels per locale

## 🎯 DDD SWARM ORCHESTRATION PATTERN

### Domain Discovery and Modeling (Single Message)

```javascript
[BatchTool - Domain Discovery]:
  // Initialize domain-driven swarm
  - mcp__claude-flow__swarm_init { 
      topology: "hierarchical", 
      maxAgents: 8, 
      strategy: "domain_driven" 
    }
  
  // Spawn multilingual DDD-specific agents
  - mcp__claude-flow__agent_spawn { type: "domain-expert", name: "Domain Expert", language: "en" }
  - mcp__claude-flow__agent_spawn { type: "business-analyst", name: "Business Analyst", language: "zh-cn" }
  - mcp__claude-flow__agent_spawn { type: "aggregate-designer", name: "Aggregate Designer", language: "ja" }
  - mcp__claude-flow__agent_spawn { type: "repository-developer", name: "Repository Developer", language: "ru" }
  - mcp__claude-flow__agent_spawn { type: "context-mapper", name: "Context Mapper", language: "de" }
  - mcp__claude-flow__agent_spawn { type: "event-sourcing-specialist", name: "Event Specialist", language: "fr" }
  - mcp__claude-flow__agent_spawn { type: "ddd-sparc-coder", name: "DDD Coder", language: "es" }

  // Domain modeling todos - ALL contexts at once
  - TodoWrite { todos: [
      { id: "domain-exploration", content: "Explore and understand the problem domain", status: "completed", priority: "high" },
      { id: "ubiquitous-language", content: "Define ubiquitous language dictionary", status: "in_progress", priority: "high" },
      { id: "bounded-contexts", content: "Identify and map bounded contexts", status: "pending", priority: "high" },
      { id: "context-mapping", content: "Define context relationships and integration patterns", status: "pending", priority: "high" },
      { id: "aggregate-design", content: "Design aggregates and entities", status: "pending", priority: "high" },
      { id: "domain-services", content: "Implement domain services", status: "pending", priority: "medium" },
      { id: "repositories", content: "Create repository interfaces", status: "pending", priority: "medium" },
      { id: "application-services", content: "Build application layer services", status: "pending", priority: "medium" },
      { id: "infrastructure", content: "Implement infrastructure concerns", status: "pending", priority: "low" },
      { id: "integration-tests", content: "Write domain integration tests", status: "pending", priority: "medium" }
    ]}

  // Initialize DDD memory context
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "ddd/domain_context", 
      value: { 
        domain: "e-commerce", 
        bounded_contexts: ["ordering", "catalog", "payment", "shipping"],
        ubiquitous_language: {},
        aggregates: {}
      } 
    }
```

## 🌐 MULTILINGUAL UBIQUITOUS LANGUAGE COORDINATION

### Language Support Matrix
- **14 Languages**: EN, RU, ZH-CN, ZH-TW, JA, KO, DE, FR, ES, PT, TR, TH, IT, HI
- **Automatic Translation**: Real-time synchronization across languages
- **Cultural Context**: Business etiquette and formality levels
- **Native Commands**: Process commands in any supported language

## 📚 UBIQUITOUS LANGUAGE COORDINATION

### Domain Language Development

**MANDATORY**: Every team member MUST use domain-specific terminology:

```bash
# Domain language validation (each developer runs this)
npx claude-flow@alpha hooks pre-task --description "Validate domain language usage" --auto-spawn-agents false
npx claude-flow@alpha hooks notify --message "Using domain terms: [Order, Customer, Product, Inventory]" --telemetry true
```

### Bounded Context Agent Template

```
You are the [Bounded Context] expert in a Multilingual Domain-Driven Design team.

MANDATORY MULTILINGUAL DDD COORDINATION:
1. UBIQUITOUS LANGUAGE: Use domain-specific terminology in [language]
2. CONTEXT BOUNDARIES: Respect bounded context isolation across languages
3. AGGREGATE CONSISTENCY: Maintain invariants with i18n validation
4. DOMAIN EVENTS: Publish multilingual events for cross-context communication
5. CULTURAL AWARENESS: Apply appropriate business etiquette for [locale]

Your bounded context: [specific context name]
Domain responsibilities: [context responsibilities]
Key aggregates: [main aggregates in this context]

REMEMBER: Model the domain, not the database!
```

## 🎭 BOUNDED CONTEXT DEVELOPMENT

### E-commerce Domain Example

```javascript
// ✅ CORRECT: Parallel bounded context development
[BatchTool - Bounded Contexts Implementation]:
  // All contexts developed in parallel
  - Task("Ordering Context: Implement Order aggregate with business rules")
  - Task("Catalog Context: Design Product and Category aggregates")
  - Task("Payment Context: Create Payment processing domain services")
  - Task("Shipping Context: Build Shipment tracking aggregate")

  // Domain layer files for each context
  - Write("src/ordering/domain/Order.ts", orderAggregateCode)
  - Write("src/catalog/domain/Product.ts", productAggregateCode)
  - Write("src/payment/domain/PaymentService.ts", paymentServiceCode)
  - Write("src/shipping/domain/Shipment.ts", shipmentAggregateCode)

  // Repository interfaces
  - Write("src/ordering/domain/OrderRepository.ts", orderRepoInterface)
  - Write("src/catalog/domain/ProductRepository.ts", productRepoInterface)
  - Write("src/payment/domain/PaymentRepository.ts", paymentRepoInterface)
  - Write("src/shipping/domain/ShipmentRepository.ts", shipmentRepoInterface)

  // Context map documentation
  - Write("docs/context-map.md", contextMapDocumentation)
  - Write("docs/ubiquitous-language.md", domainLanguageDictionary)

  // Store context relationships
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "ddd/context_map", 
      value: { 
        ordering_catalog: "customer_supplier",
        ordering_payment: "conformist",
        ordering_shipping: "anticorruption_layer"
      } 
    }
```

## 🏛️ LAYERED ARCHITECTURE PATTERN

### Hexagonal Architecture Implementation

```javascript
[BatchTool - Hexagonal Architecture]:
  // Create all layers simultaneously
  - Bash("mkdir -p src/{domain,application,infrastructure}/{ordering,catalog,payment,shipping}")
  - Bash("mkdir -p src/domain/{aggregates,entities,value-objects,services,events}")
  - Bash("mkdir -p src/application/{commands,queries,handlers,services}")
  - Bash("mkdir -p src/infrastructure/{persistence,messaging,web,external}")

  // Domain layer implementation
  - Write("src/domain/ordering/Order.ts", orderDomainCode)
  - Write("src/domain/ordering/OrderItem.ts", orderItemEntityCode)
  - Write("src/domain/ordering/Money.ts", moneyValueObjectCode)
  - Write("src/domain/ordering/OrderStatus.ts", orderStatusCode)

  // Application layer implementation
  - Write("src/application/ordering/CreateOrderCommand.ts", createOrderCommandCode)
  - Write("src/application/ordering/CreateOrderHandler.ts", createOrderHandlerCode)
  - Write("src/application/ordering/OrderApplicationService.ts", orderAppServiceCode)

  // Infrastructure layer implementation
  - Write("src/infrastructure/ordering/OrderRepositoryImpl.ts", orderRepoImplCode)
  - Write("src/infrastructure/ordering/OrderController.ts", orderControllerCode)
```

## 🔄 AGGREGATE DESIGN PATTERNS

### Aggregate Root Development

```typescript
// Example Multilingual Order Aggregate implementation
export class Order extends MultilingualAggregate {
  private constructor(
    private readonly id: OrderId,
    private readonly customerId: CustomerId,
    private items: OrderItem[],
    private status: OrderStatus,
    private readonly createdAt: Date
  ) {}

  // Factory method
  static create(customerId: CustomerId, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new InvalidOrderError("Order must have at least one item");
    }
    
    return new Order(
      OrderId.generate(),
      customerId,
      items,
      OrderStatus.PENDING,
      new Date()
    );
  }

  // Business methods
  addItem(item: OrderItem): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new InvalidOrderError("Cannot modify confirmed order");
    }
    this.items.push(item);
  }

  confirm(): void {
    if (this.items.length === 0) {
      throw new InvalidOrderError("Cannot confirm empty order");
    }
    this.status = OrderStatus.CONFIRMED;
    
    // Publish domain event
    DomainEvents.publish(new OrderConfirmedEvent(this.id, this.customerId));
  }
}
```

### Value Objects and Entities

```javascript
[BatchTool - Domain Objects]:
  // All domain objects created together
  - Write("src/domain/shared/Money.ts", moneyValueObjectCode)
  - Write("src/domain/shared/Address.ts", addressValueObjectCode)
  - Write("src/domain/shared/Email.ts", emailValueObjectCode)
  - Write("src/domain/ordering/OrderId.ts", orderIdCode)
  - Write("src/domain/ordering/CustomerId.ts", customerIdCode)
  - Write("src/domain/catalog/ProductId.ts", productIdCode)
  - Write("src/domain/catalog/Price.ts", priceValueObjectCode)
```

## 🌐 DOMAIN EVENTS AND INTEGRATION

### Event-Driven Architecture

```javascript
[BatchTool - Domain Events]:
  // Event infrastructure setup
  - Write("src/domain/shared/DomainEvent.ts", domainEventInterfaceCode)
  - Write("src/domain/shared/DomainEvents.ts", domainEventPublisherCode)
  - Write("src/application/shared/EventHandler.ts", eventHandlerInterfaceCode)

  // Context-specific events
  - Write("src/domain/ordering/events/OrderCreatedEvent.ts", orderCreatedEventCode)
  - Write("src/domain/ordering/events/OrderConfirmedEvent.ts", orderConfirmedEventCode)
  - Write("src/domain/payment/events/PaymentProcessedEvent.ts", paymentProcessedEventCode)
  - Write("src/domain/shipping/events/ShipmentCreatedEvent.ts", shipmentCreatedEventCode)

  // Event handlers
  - Write("src/application/ordering/OrderCreatedHandler.ts", orderCreatedHandlerCode)
  - Write("src/application/payment/ProcessPaymentHandler.ts", processPaymentHandlerCode)
  - Write("src/application/shipping/CreateShipmentHandler.ts", createShipmentHandlerCode)

  // Event store memory
  - mcp__claude-flow__memory_usage { 
      action: "store", 
      key: "ddd/domain_events", 
      value: { 
        event_types: ["OrderCreated", "OrderConfirmed", "PaymentProcessed", "ShipmentCreated"],
        event_handlers: {},
        event_projections: {}
      } 
    }
```

## 🏗️ STRATEGIC DESIGN PATTERNS

### Context Mapping Coordination

```bash
# Context relationship validation
npx claude-flow@alpha hooks pre-search --query "validate context boundaries" --cache-results true
npx claude-flow@alpha hooks notify --message "Context mapping: [upstream/downstream relationships]" --telemetry true
```

### Anti-Corruption Layer Pattern

```javascript
[BatchTool - ACL Implementation]:
  // Anti-corruption layers for external systems
  - Write("src/infrastructure/external/LegacyOrderSystemACL.ts", legacyOrderACLCode)
  - Write("src/infrastructure/external/PaymentGatewayACL.ts", paymentGatewayACLCode)
  - Write("src/infrastructure/external/ShippingProviderACL.ts", shippingProviderACLCode)

  // Translation services
  - Write("src/infrastructure/external/OrderTranslationService.ts", orderTranslationCode)
  - Write("src/infrastructure/external/PaymentTranslationService.ts", paymentTranslationCode)
```

## 🧪 DOMAIN TESTING STRATEGIES

### Specification by Example

```javascript
[BatchTool - Domain Tests]:
  // Aggregate behavior tests
  - Write("tests/domain/ordering/Order.spec.ts", orderAggregateTestsCode)
  - Write("tests/domain/catalog/Product.spec.ts", productAggregateTestsCode)
  - Write("tests/domain/payment/PaymentService.spec.ts", paymentServiceTestsCode)

  // Domain service tests
  - Write("tests/domain/ordering/OrderDomainService.spec.ts", orderDomainServiceTestsCode)
  - Write("tests/domain/catalog/PricingService.spec.ts", pricingServiceTestsCode)

  // Integration tests for bounded contexts
  - Write("tests/integration/OrderingContext.spec.ts", orderingContextTestsCode)
  - Write("tests/integration/CatalogContext.spec.ts", catalogContextTestsCode)

  // Event handling tests
  - Write("tests/application/OrderEventHandlers.spec.ts", orderEventHandlersTestsCode)
```

## 📋 DDD BEST PRACTICES FOR CLAUDE CODE

### ✅ DO:

- **Domain First**: Always start with domain modeling before technical concerns
- **Ubiquitous Language**: Use domain terminology consistently across all contexts
- **Bounded Contexts**: Respect context boundaries and avoid leaky abstractions
- **Aggregate Consistency**: Maintain business invariants within aggregate boundaries
- **Domain Events**: Use events for cross-context communication
- **Repository Pattern**: Abstract data access behind domain-aligned interfaces

### ❌ DON'T:

- Never expose database concerns to the domain layer
- Don't create anemic domain models (data without behavior)
- Avoid cross-aggregate transactions within a single operation
- Don't let technical concerns drive domain design
- Never skip ubiquitous language development with domain experts
- Don't create large, monolithic aggregates

## 🔍 DOMAIN ANALYSIS PATTERNS

### Event Storming Integration

```bash
# Event storming session coordination
npx claude-flow@alpha hooks pre-task --description "Event storming session" --auto-spawn-agents false
npx claude-flow@alpha hooks notify --message "Domain events identified: [list of events]" --telemetry true
```

### Domain Expert Collaboration

```
You are the Domain Expert agent collaborating with technical teams.

MANDATORY DOMAIN EXPERT DUTIES:
1. LANGUAGE DEFINITION: Establish and maintain ubiquitous language
2. BUSINESS RULES: Define and validate business invariants
3. PROCESS MODELING: Map business workflows and policies
4. CONTEXT IDENTIFICATION: Help identify bounded context boundaries

Your expertise: [specific domain knowledge area]
Business rules: [key business constraints]
Stakeholders: [business stakeholders you represent]

REMEMBER: Focus on business value and domain accuracy!
```

## 🚀 CQRS AND EVENT SOURCING INTEGRATION

### Command Query Responsibility Segregation

```javascript
[BatchTool - CQRS Implementation]:
  // Command side implementation
  - Write("src/application/commands/CreateOrderCommand.ts", createOrderCommandCode)
  - Write("src/application/commands/ConfirmOrderCommand.ts", confirmOrderCommandCode)
  - Write("src/application/handlers/CreateOrderHandler.ts", createOrderHandlerCode)
  - Write("src/application/handlers/ConfirmOrderHandler.ts", confirmOrderHandlerCode)

  // Query side implementation
  - Write("src/application/queries/GetOrderQuery.ts", getOrderQueryCode)
  - Write("src/application/queries/GetOrderListQuery.ts", getOrderListQueryCode)
  - Write("src/application/handlers/GetOrderHandler.ts", getOrderHandlerCode)
  - Write("src/application/handlers/GetOrderListHandler.ts", getOrderListHandlerCode)

  // Read models for queries
  - Write("src/infrastructure/readmodels/OrderReadModel.ts", orderReadModelCode)
  - Write("src/infrastructure/readmodels/OrderListReadModel.ts", orderListReadModelCode)
```

### Event Sourcing Pattern

```javascript
[BatchTool - Event Sourcing]:
  // Event store implementation
  - Write("src/infrastructure/eventsourcing/EventStore.ts", eventStoreCode)
  - Write("src/infrastructure/eventsourcing/EventStream.ts", eventStreamCode)
  - Write("src/infrastructure/eventsourcing/Snapshot.ts", snapshotCode)

  // Aggregate persistence
  - Write("src/infrastructure/eventsourcing/EventSourcedRepository.ts", eventSourcedRepoCode)
  - Write("src/infrastructure/eventsourcing/OrderEventSourcedRepository.ts", orderEventSourcedRepoCode)

  // Event projections
  - Write("src/infrastructure/projections/OrderProjection.ts", orderProjectionCode)
  - Write("src/infrastructure/projections/CustomerOrderHistoryProjection.ts", customerOrderHistoryProjectionCode)
```

## 📈 MICROSERVICES AND DDD

### Service per Bounded Context

```javascript
[BatchTool - Microservices Architecture]:
  // Service boundaries aligned with bounded contexts
  - Bash("mkdir -p services/{ordering-service,catalog-service,payment-service,shipping-service}")
  
  // Service implementations
  - Write("services/ordering-service/package.json", orderingServicePackageJson)
  - Write("services/catalog-service/package.json", catalogServicePackageJson)
  - Write("services/payment-service/package.json", paymentServicePackageJson)
  - Write("services/shipping-service/package.json", shippingServicePackageJson)

  // API contracts
  - Write("services/ordering-service/src/api/OrderingAPI.ts", orderingAPICode)
  - Write("services/catalog-service/src/api/CatalogAPI.ts", catalogAPICode)
  - Write("services/payment-service/src/api/PaymentAPI.ts", paymentAPICode)
  - Write("services/shipping-service/src/api/ShippingAPI.ts", shippingAPICode)

  // Service communication
  - Write("shared/events/DomainEvents.ts", sharedDomainEventsCode)
  - Write("shared/contracts/ServiceContracts.ts", serviceContractsCode)
```

## 💡 ADVANCED DDD PATTERNS

### Specification Pattern

```typescript
// Domain specifications for complex business rules
export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

export class OrderEligibleForDiscountSpecification implements Specification<Order> {
  isSatisfiedBy(order: Order): boolean {
    return order.totalAmount.isGreaterThan(Money.of(100)) &&
           order.customer.isLoyaltyMember() &&
           order.createdAt.isWithinLast(30, 'days');
  }
}
```

### Domain Service Coordination

```javascript
[BatchTool - Domain Services]:
  // Cross-aggregate domain services
  - Write("src/domain/ordering/OrderDomainService.ts", orderDomainServiceCode)
  - Write("src/domain/catalog/PricingDomainService.ts", pricingDomainServiceCode)
  - Write("src/domain/payment/PaymentValidationService.ts", paymentValidationServiceCode)

  // Policy implementations
  - Write("src/domain/ordering/policies/DiscountPolicy.ts", discountPolicyCode)
  - Write("src/domain/ordering/policies/ShippingPolicy.ts", shippingPolicyCode)
  - Write("src/domain/catalog/policies/PricingPolicy.ts", pricingPolicyCode)
```

## 🚀 Multilingual Command Examples

### Russian DDD Commands
```bash
# Создать ограниченный контекст
npx ddd-sparc context create "электронная коммерция" --language ru

# Добавить агрегат
npx ddd-sparc aggregate add Заказ --context заказы --language ru
```

### Chinese DDD Commands
```bash
# 创建限界上下文
npx ddd-sparc context create "电子商务" --language zh-cn

# 添加聚合根
npx ddd-sparc aggregate add 订单 --context 订购 --language zh-cn
```

### Japanese DDD Commands
```bash
# 境界づけられたコンテキストを作成
npx ddd-sparc context create "eコマース" --language ja

# 集約を追加
npx ddd-sparc aggregate add 注文 --context 注文管理 --language ja
```

## 🌏 Cultural Context in DDD

### Business Etiquette Patterns
```typescript
export class CulturalDomainService {
  applyBusinessEtiquette(command: Command, locale: string): Command {
    const context = this.culturalAnalyzer.analyze(locale);
    
    // Apply formality levels
    if (context.formalityLevel === 'high') {
      command.metadata.honorifics = true;
      command.metadata.indirectCommunication = true;
    }
    
    // Apply decision-making patterns
    if (context.decisionMaking === 'consensus') {
      command.requiresApproval = true;
      command.approvalLevels = context.hierarchyLevels;
    }
    
    return command;
  }
}
```

### Multilingual Event Sourcing
```typescript
export class MultilingualEventStore {
  async append(event: DomainEvent, languages: string[]): Promise<void> {
    // Store event in multiple languages
    for (const lang of languages) {
      const translatedEvent = await this.translator.translate(event, lang);
      await this.store.append(translatedEvent);
    }
    
    // Publish to language-specific subscribers
    this.publishToSubscribers(event, languages);
  }
}
```

---

**Remember**: Domain-Driven Design with Claude Flow Multilang puts the domain at the center while breaking language barriers. Our framework provides intelligent coordination for complex domain modeling across 14 languages with full cultural awareness!