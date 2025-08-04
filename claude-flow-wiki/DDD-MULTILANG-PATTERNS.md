# DDD Multilingual Patterns - Claude Flow Multilang

## 🌍 Multilingual Domain-Driven Design Patterns

### Pattern 1: Multilingual Aggregate Root

```typescript
export abstract class MultilingualAggregate {
  protected language: SupportedLanguage;
  protected translations: Map<string, TranslationSet>;
  protected culturalContext: CulturalContext;
  
  constructor(id: string, language: SupportedLanguage = SupportedLanguage.EN) {
    this.language = language;
    this.translations = new Map();
    this.culturalContext = CulturalContextAnalyzer.analyze(language);
  }
  
  // Translate business rule violations
  protected throwDomainError(key: string, params?: any): never {
    const message = this.translate(key, params);
    throw new DomainError(message, this.language);
  }
  
  // Apply cultural business rules
  protected applyCulturalRules<T>(value: T): T {
    return this.culturalContext.applyBusinessRules(value);
  }
}
```

### Pattern 2: Polyglot Command Handler

```typescript
export class PolyglotCommandHandler<TCommand extends ICommand, TResult> {
  constructor(
    private translator: ITranslator,
    private culturalAnalyzer: ICulturalAnalyzer,
    private handler: ICommandHandler<TCommand, TResult>
  ) {}
  
  async handle(command: TCommand, language: string): Promise<TResult> {
    // Translate command
    const translatedCommand = await this.translator.translateCommand(command, language);
    
    // Apply cultural context
    const culturalCommand = this.culturalAnalyzer.applyCulturalContext(
      translatedCommand,
      language
    );
    
    // Execute with original handler
    const result = await this.handler.handle(culturalCommand);
    
    // Translate result back
    return this.translator.translateResult(result, language);
  }
}
```

### Pattern 3: Multilingual Event Sourcing

```typescript
export class MultilingualEventStore {
  private stores: Map<string, IEventStore> = new Map();
  
  async append(event: DomainEvent, languages: string[]): Promise<void> {
    const promises = languages.map(async (lang) => {
      const translatedEvent = await this.translateEvent(event, lang);
      const store = this.getStoreForLanguage(lang);
      return store.append(translatedEvent);
    });
    
    await Promise.all(promises);
  }
  
  async getEvents(aggregateId: string, language: string): Promise<DomainEvent[]> {
    const store = this.getStoreForLanguage(language);
    return store.getEvents(aggregateId);
  }
  
  private async translateEvent(event: DomainEvent, language: string): Promise<DomainEvent> {
    return {
      ...event,
      data: await this.translator.translate(event.data, language),
      metadata: {
        ...event.metadata,
        language,
        originalLanguage: event.metadata.language || 'en'
      }
    };
  }
}
```

## 🏗️ Bounded Context Patterns

### Pattern 4: Language-Isolated Bounded Contexts

```typescript
export class MultilingualBoundedContext {
  private contexts: Map<string, BoundedContext> = new Map();
  private translator: ContextTranslator;
  
  constructor(
    private name: string,
    private supportedLanguages: string[]
  ) {
    this.initializeContexts();
  }
  
  private initializeContexts(): void {
    this.supportedLanguages.forEach(lang => {
      this.contexts.set(lang, new BoundedContext(
        `${this.name}_${lang}`,
        this.createUbiquitousLanguage(lang)
      ));
    });
  }
  
  async executeInContext<T>(
    language: string,
    operation: (context: BoundedContext) => Promise<T>
  ): Promise<T> {
    const context = this.contexts.get(language);
    if (!context) {
      throw new Error(`Language ${language} not supported in ${this.name} context`);
    }
    return operation(context);
  }
}
```

### Pattern 5: Cross-Context Translation Layer

```typescript
export class CrossContextTranslator {
  constructor(
    private sourceContext: string,
    private targetContext: string,
    private translationMap: TranslationMap
  ) {}
  
  async translateMessage(message: any, fromLang: string, toLang: string): Promise<any> {
    // Apply context-specific translations
    const contextTranslated = this.applyContextMapping(message);
    
    // Apply language translation
    const languageTranslated = await this.translateLanguage(
      contextTranslated,
      fromLang,
      toLang
    );
    
    // Apply cultural adaptations
    return this.applyCulturalAdaptations(languageTranslated, toLang);
  }
  
  private applyContextMapping(message: any): any {
    // Map domain concepts between contexts
    return this.translationMap.translate(message, this.sourceContext, this.targetContext);
  }
}
```

## 🌐 Cultural Business Patterns

### Pattern 6: Cultural Decision Engine

```typescript
export class CulturalDecisionEngine {
  private rules: Map<string, CulturalBusinessRules> = new Map();
  
  constructor() {
    this.initializeRules();
  }
  
  private initializeRules(): void {
    // Japanese consensus-based decisions
    this.rules.set('ja', {
      decisionStyle: 'consensus',
      approvalLevels: 3,
      requiresGroupMeeting: true,
      documentationLevel: 'detailed'
    });
    
    // American individual-based decisions
    this.rules.set('en-US', {
      decisionStyle: 'individual',
      approvalLevels: 1,
      requiresGroupMeeting: false,
      documentationLevel: 'summary'
    });
    
    // German process-based decisions
    this.rules.set('de', {
      decisionStyle: 'process',
      approvalLevels: 2,
      requiresGroupMeeting: false,
      documentationLevel: 'comprehensive'
    });
  }
  
  async processDecision(decision: Decision, locale: string): Promise<DecisionResult> {
    const rules = this.rules.get(locale) || this.rules.get('en');
    
    if (rules.requiresGroupMeeting) {
      await this.scheduleGroupMeeting(decision);
    }
    
    if (rules.decisionStyle === 'consensus') {
      return this.processConsensusDecision(decision, rules);
    }
    
    return this.processStandardDecision(decision, rules);
  }
}
```

### Pattern 7: Formality-Aware Communication

```typescript
export class FormalityAwareCommunicator {
  communicate(message: string, fromLocale: string, toLocale: string): string {
    const formality = this.determineFormalityLevel(fromLocale, toLocale);
    
    switch (formality) {
      case 'very-formal':
        return this.applyVeryFormalStyle(message, toLocale);
      case 'formal':
        return this.applyFormalStyle(message, toLocale);
      case 'neutral':
        return this.applyNeutralStyle(message, toLocale);
      case 'informal':
        return this.applyInformalStyle(message, toLocale);
      default:
        return message;
    }
  }
  
  private determineFormalityLevel(from: string, to: string): FormalityLevel {
    const levels: Record<string, FormalityLevel> = {
      'ja': 'very-formal',
      'ko': 'very-formal',
      'de': 'formal',
      'fr': 'formal',
      'en': 'neutral',
      'es': 'neutral',
      'pt': 'informal'
    };
    
    return levels[to] || 'neutral';
  }
}
```

## 🔄 Repository Patterns

### Pattern 8: Multilingual Repository with Caching

```typescript
export class MultilingualRepository<T extends AggregateRoot> {
  private cache: Map<string, Map<string, T>> = new Map();
  
  constructor(
    private baseRepository: IRepository<T>,
    private translator: IAggregateTranslator
  ) {
    this.initializeLanguageCaches();
  }
  
  async findById(id: string, language: string): Promise<T | null> {
    // Check language-specific cache
    const languageCache = this.cache.get(language);
    if (languageCache?.has(id)) {
      return languageCache.get(id)!;
    }
    
    // Fetch from base repository
    const entity = await this.baseRepository.findById(id);
    if (!entity) return null;
    
    // Translate to requested language
    const translated = await this.translator.translate(entity, language);
    
    // Cache the result
    this.cacheEntity(translated, language);
    
    return translated;
  }
  
  async save(entity: T, language: string): Promise<void> {
    // Save in original language
    await this.baseRepository.save(entity);
    
    // Invalidate all language caches for this entity
    this.invalidateCaches(entity.id);
    
    // Pre-cache in common languages
    await this.preCacheCommonLanguages(entity);
  }
  
  private async preCacheCommonLanguages(entity: T): Promise<void> {
    const commonLanguages = ['en', 'zh-cn', 'ja', 'es'];
    
    await Promise.all(
      commonLanguages.map(async (lang) => {
        const translated = await this.translator.translate(entity, lang);
        this.cacheEntity(translated, lang);
      })
    );
  }
}
```

## 🎭 Service Layer Patterns

### Pattern 9: Culturally Adaptive Application Service

```typescript
export class CulturallyAdaptiveService {
  async processOrder(
    orderData: OrderData,
    customerLocale: string
  ): Promise<OrderResult> {
    // Apply cultural business rules
    const culturalRules = this.getCulturalRules(customerLocale);
    
    // Validate according to cultural norms
    if (culturalRules.requiresPhoneVerification) {
      await this.verifyPhoneNumber(orderData.phone, customerLocale);
    }
    
    // Apply cultural pricing strategies
    const pricing = await this.applyCulturalPricing(
      orderData.items,
      customerLocale
    );
    
    // Create order with cultural context
    const order = Order.create(
      orderData,
      pricing,
      culturalRules
    );
    
    // Send culturally appropriate notifications
    await this.sendCulturalNotification(order, customerLocale);
    
    return this.formatResult(order, customerLocale);
  }
  
  private async applyCulturalPricing(
    items: OrderItem[],
    locale: string
  ): Promise<Pricing> {
    const strategy = this.getPricingStrategy(locale);
    
    // Apply regional pricing rules
    if (locale === 'ja' || locale === 'ko') {
      // No tipping culture
      strategy.includeTip = false;
    }
    
    if (locale === 'de' || locale === 'fr') {
      // VAT inclusive pricing
      strategy.vatInclusive = true;
    }
    
    return strategy.calculate(items);
  }
}
```

## 🔐 Security Patterns

### Pattern 10: Language-Aware Authorization

```typescript
export class MultilingualAuthorizationService {
  async authorize(
    user: User,
    resource: Resource,
    action: Action,
    locale: string
  ): Promise<AuthorizationResult> {
    // Get culturally appropriate permissions
    const culturalPermissions = await this.getCulturalPermissions(
      user.role,
      locale
    );
    
    // Apply language-specific security rules
    const securityRules = this.getSecurityRules(locale);
    
    // Check standard authorization
    const standardAuth = await this.checkStandardAuthorization(
      user,
      resource,
      action
    );
    
    // Apply cultural modifiers
    const culturalAuth = this.applyCulturalModifiers(
      standardAuth,
      culturalPermissions,
      securityRules
    );
    
    // Log in appropriate language
    await this.logAuthorization(culturalAuth, locale);
    
    return culturalAuth;
  }
  
  private applyCulturalModifiers(
    auth: AuthorizationResult,
    permissions: CulturalPermissions,
    rules: SecurityRules
  ): AuthorizationResult {
    // Apply hierarchical permissions for Asian markets
    if (rules.respectHierarchy) {
      auth.requiresSuperiorApproval = true;
    }
    
    // Apply GDPR for European markets
    if (rules.gdprCompliant) {
      auth.requiresDataProcessingConsent = true;
    }
    
    return auth;
  }
}
```

## 📊 Usage Examples

### Example 1: Creating a Multilingual Order System

```typescript
// Initialize multilingual DDD system
const system = new MultilingualDDDSystem({
  languages: ['en', 'ru', 'zh-cn', 'ja'],
  primaryLanguage: 'en',
  enableCulturalContext: true
});

// Create order in Japanese with cultural rules
const order = await system.executeCommand(
  new CreateOrderCommand({
    customerId: 'customer-123',
    items: [{ productId: 'prod-1', quantity: 2 }]
  }),
  'ja'
);

// Order will follow Japanese business etiquette:
// - Formal communication style
// - Detailed documentation
// - Group consensus for large orders
// - No tipping in pricing
```

### Example 2: Cross-Context Event Translation

```typescript
// Order context publishes event in English
const orderContext = new BoundedContext('ordering', 'en');
await orderContext.publish(new OrderCreatedEvent(orderData));

// Shipping context receives in Chinese
const shippingContext = new BoundedContext('shipping', 'zh-cn');
shippingContext.subscribe(OrderCreatedEvent, async (event) => {
  // Event automatically translated to Chinese
  console.log(event.data.customerName); // Shows Chinese name
  console.log(event.data.address); // Shows Chinese address format
});
```

## 🎯 Best Practices

1. **Always specify primary language** for each bounded context
2. **Cache translations aggressively** to improve performance
3. **Use cultural context** for business rule variations
4. **Implement fallback languages** for unsupported locales
5. **Log in user's language** for better debugging
6. **Test with multiple languages** in integration tests
7. **Document language-specific behaviors** in code
8. **Use type-safe language enums** to prevent errors

## 🔗 Related Documentation

- [Multilingual Features Overview](./MULTILANG-FEATURES.md)
- [Cultural Context Guide](./CULTURAL-CONTEXT.md)
- [DDD Integration Guide](./DDD-GUIDE.md)
- [API Reference](./API-REFERENCE.md)

---

**Claude Flow Multilang** - Making Domain-Driven Design Truly Global 🌍