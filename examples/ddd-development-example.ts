/**
 * Claude Flow Multilang - DDD Development Workflow Example
 * Shows how to use DDD in actual development process
 */

import { DDDDevelopmentService, DDDPhase } from '../src/domain/application/ddd-development-service.js';
import { SupportedLanguage } from '../src/polyglot/types.js';
import { PolyglotAgent } from '../src/polyglot/polyglot-agent.js';
import { MultilingualString } from '../src/domain/base-domain.js';
import { Logger } from '../src/core/logger.js';

const logger = new Logger();

/**
 * Example: Complete DDD Development Workflow
 * Building an e-commerce system using DDD
 */
async function runDDDDevelopmentWorkflow() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     DDD Development Workflow - E-Commerce System       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  // Initialize polyglot agent for multilingual support
  const agent = new PolyglotAgent(
    'DDD Assistant',
    ['domain-modeling', 'architecture', 'code-generation'],
    logger,
    SupportedLanguage.EN,
  );
  
  // Initialize DDD development service
  const dddService = new DDDDevelopmentService(logger, agent);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: START DDD DEVELOPMENT
  // ═══════════════════════════════════════════════════════════════
  
  console.log('📋 Phase 1: Starting DDD Development Process\n');
  
  const workflow = await dddService.startDevelopment(
    {
      [SupportedLanguage.EN]: 'E-Commerce Platform',
      [SupportedLanguage.RU]: 'Платформа электронной коммерции',
      [SupportedLanguage.JA]: 'Eコマースプラットフォーム',
      [SupportedLanguage.ZH_CN]: '电子商务平台',
    },
    {
      [SupportedLanguage.EN]: 'Modern e-commerce platform with DDD architecture',
      [SupportedLanguage.RU]: 'Современная платформа электронной коммерции с DDD архитектурой',
      [SupportedLanguage.JA]: 'DDDアーキテクチャを持つ現代的なEコマースプラットフォーム',
      [SupportedLanguage.ZH_CN]: '具有DDD架构的现代电子商务平台',
    },
    {
      methodology: 'event-storming',
      team: 'Global Development Team',
      primaryLanguage: SupportedLanguage.EN,
    },
  );
  
  console.log(`✅ Workflow created: ${workflow.getName(SupportedLanguage.EN)}`);
  console.log(`   Progress: ${workflow.getProgress().percentage}%\n`);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: CREATE BOUNDED CONTEXTS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('📦 Phase 2: Creating Bounded Contexts\n');
  
  // Create Catalog bounded context
  const catalogContext = await dddService.createBoundedContext(
    {
      [SupportedLanguage.EN]: 'Product Catalog',
      [SupportedLanguage.RU]: 'Каталог продуктов',
      [SupportedLanguage.JA]: '製品カタログ',
      [SupportedLanguage.ZH_CN]: '产品目录',
    },
    {
      [SupportedLanguage.EN]: 'Manages products, categories, and inventory',
      [SupportedLanguage.RU]: 'Управляет продуктами, категориями и инвентарем',
      [SupportedLanguage.JA]: '製品、カテゴリ、在庫を管理',
      [SupportedLanguage.ZH_CN]: '管理产品、类别和库存',
    },
    {
      team: 'Catalog Team',
      language: SupportedLanguage.EN,
    },
  );
  
  console.log(`✅ Created bounded context: ${catalogContext.name.get(SupportedLanguage.EN)}`);
  
  // Create Order Management bounded context
  const orderContext = await dddService.createBoundedContext(
    {
      [SupportedLanguage.EN]: 'Order Management',
      [SupportedLanguage.RU]: 'Управление заказами',
      [SupportedLanguage.JA]: '注文管理',
      [SupportedLanguage.ZH_CN]: '订单管理',
    },
    {
      [SupportedLanguage.EN]: 'Handles order processing, payment, and fulfillment',
      [SupportedLanguage.RU]: 'Обрабатывает заказы, платежи и выполнение',
      [SupportedLanguage.JA]: '注文処理、支払い、履行を処理',
      [SupportedLanguage.ZH_CN]: '处理订单、支付和履行',
    },
    {
      team: 'Order Team',
      language: SupportedLanguage.EN,
    },
  );
  
  console.log(`✅ Created bounded context: ${orderContext.name.get(SupportedLanguage.EN)}\n`);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: DESIGN AGGREGATES
  // ═══════════════════════════════════════════════════════════════
  
  console.log('🏗️  Phase 3: Designing Aggregates\n');
  
  // Design Product aggregate
  const productAggregate = {
    id: 'product-aggregate',
    name: new MultilingualString({
      [SupportedLanguage.EN]: 'Product',
      [SupportedLanguage.RU]: 'Продукт',
      [SupportedLanguage.JA]: '製品',
      [SupportedLanguage.ZH_CN]: '产品',
    }),
    description: new MultilingualString({
      [SupportedLanguage.EN]: 'Product aggregate with pricing and inventory',
      [SupportedLanguage.RU]: 'Агрегат продукта с ценами и инвентарем',
      [SupportedLanguage.JA]: '価格と在庫を持つ製品集約',
      [SupportedLanguage.ZH_CN]: '具有定价和库存的产品聚合',
    }),
    properties: [
      { name: 'id', type: 'EntityId', required: true, multilingual: false },
      { name: 'name', type: 'MultilingualString', required: true, multilingual: true },
      { name: 'description', type: 'MultilingualString', required: true, multilingual: true },
      { name: 'price', type: 'Money', required: true, multilingual: false },
      { name: 'inventory', type: 'number', required: true, multilingual: false },
      { name: 'category', type: 'CategoryId', required: true, multilingual: false },
      { name: 'status', type: 'ProductStatus', required: true, multilingual: false },
    ],
    methods: [
      {
        name: 'updatePrice',
        description: new MultilingualString({
          [SupportedLanguage.EN]: 'Update product price',
          [SupportedLanguage.RU]: 'Обновить цену продукта',
        }),
        parameters: [
          { name: 'newPrice', type: 'Money', required: true },
        ],
        returnType: 'void',
        businessRules: [
          'Price must be positive',
          'Price changes trigger PriceUpdatedEvent',
          'Cannot change price if product is discontinued',
        ],
      },
      {
        name: 'adjustInventory',
        description: new MultilingualString({
          [SupportedLanguage.EN]: 'Adjust product inventory',
          [SupportedLanguage.RU]: 'Корректировать инвентарь продукта',
        }),
        parameters: [
          { name: 'quantity', type: 'number', required: true },
          { name: 'reason', type: 'string', required: true },
        ],
        returnType: 'void',
        businessRules: [
          'Inventory cannot be negative',
          'Low inventory triggers alert',
          'Inventory changes are logged',
        ],
      },
    ],
    events: ['ProductCreated', 'PriceUpdated', 'InventoryAdjusted', 'ProductDiscontinued'],
    invariants: [
      'Product must have a positive price',
      'Inventory cannot be negative',
      'Discontinued products cannot be modified',
    ],
  };
  
  await dddService.addAggregate(catalogContext.id, productAggregate);
  console.log(`✅ Added aggregate: ${productAggregate.name.get(SupportedLanguage.EN)}`);
  
  // Design Order aggregate
  const orderAggregate = {
    id: 'order-aggregate',
    name: new MultilingualString({
      [SupportedLanguage.EN]: 'Order',
      [SupportedLanguage.RU]: 'Заказ',
      [SupportedLanguage.JA]: '注文',
      [SupportedLanguage.ZH_CN]: '订单',
    }),
    description: new MultilingualString({
      [SupportedLanguage.EN]: 'Order aggregate with line items and payment',
      [SupportedLanguage.RU]: 'Агрегат заказа с позициями и оплатой',
      [SupportedLanguage.JA]: '明細と支払いを持つ注文集約',
      [SupportedLanguage.ZH_CN]: '具有订单项和支付的订单聚合',
    }),
    properties: [
      { name: 'id', type: 'EntityId', required: true, multilingual: false },
      { name: 'customerId', type: 'CustomerId', required: true, multilingual: false },
      { name: 'items', type: 'OrderItem[]', required: true, multilingual: false },
      { name: 'shippingAddress', type: 'Address', required: true, multilingual: false },
      { name: 'totalAmount', type: 'Money', required: true, multilingual: false },
      { name: 'status', type: 'OrderStatus', required: true, multilingual: false },
      { name: 'paymentStatus', type: 'PaymentStatus', required: true, multilingual: false },
    ],
    methods: [
      {
        name: 'addItem',
        description: new MultilingualString({
          [SupportedLanguage.EN]: 'Add item to order',
          [SupportedLanguage.RU]: 'Добавить товар в заказ',
        }),
        parameters: [
          { name: 'productId', type: 'ProductId', required: true },
          { name: 'quantity', type: 'number', required: true },
          { name: 'price', type: 'Money', required: true },
        ],
        returnType: 'void',
        businessRules: [
          'Cannot add items to confirmed orders',
          'Quantity must be positive',
          'Recalculate total after adding item',
        ],
      },
      {
        name: 'confirmOrder',
        description: new MultilingualString({
          [SupportedLanguage.EN]: 'Confirm order for processing',
          [SupportedLanguage.RU]: 'Подтвердить заказ для обработки',
        }),
        parameters: [],
        returnType: 'void',
        businessRules: [
          'Order must have at least one item',
          'Shipping address must be valid',
          'Payment must be authorized',
          'Stock must be reserved',
        ],
      },
    ],
    events: ['OrderCreated', 'ItemAdded', 'OrderConfirmed', 'OrderShipped', 'OrderDelivered'],
    invariants: [
      'Order must have at least one item to be confirmed',
      'Total amount must equal sum of item prices',
      'Cannot modify confirmed orders',
    ],
  };
  
  await dddService.addAggregate(orderContext.id, orderAggregate);
  console.log(`✅ Added aggregate: ${orderAggregate.name.get(SupportedLanguage.EN)}\n`);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: VALIDATE DOMAIN MODEL
  // ═══════════════════════════════════════════════════════════════
  
  console.log('✔️  Phase 4: Validating Domain Model\n');
  
  const catalogValidation = await dddService.validateDomainModel(catalogContext.id);
  console.log(`Catalog Context Validation:`);
  console.log(`  Valid: ${catalogValidation.valid ? '✅' : '❌'}`);
  
  if (catalogValidation.issues.length > 0) {
    console.log(`  Issues:`);
    catalogValidation.issues.forEach(issue => console.log(`    - ${issue}`));
  }
  
  if (catalogValidation.suggestions.length > 0) {
    console.log(`  Suggestions:`);
    catalogValidation.suggestions.forEach(suggestion => console.log(`    💡 ${suggestion}`));
  }
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: GENERATE CODE
  // ═══════════════════════════════════════════════════════════════
  
  console.log('🚀 Phase 5: Generating Code\n');
  
  const generatedFiles = await dddService.generateCode(catalogContext.id, {
    language: 'typescript',
    includeTests: true,
    includeRepositories: true,
    includeServices: false,
  });
  
  console.log(`Generated ${generatedFiles.size} files:`);
  for (const [fileName, content] of generatedFiles.entries()) {
    console.log(`  📄 ${fileName} (${content.length} bytes)`);
    
    // Show a snippet of the generated code
    if (fileName === 'Product.ts') {
      console.log('\n--- Product.ts snippet ---');
      console.log(content.substring(0, 500) + '...\n');
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: DEVELOPMENT STATUS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('📊 Phase 6: Development Status\n');
  
  const status = dddService.getStatus();
  console.log('DDD Development Status:');
  console.log(`  Current Phase: ${status.phase}`);
  console.log(`  Bounded Contexts: ${status.boundedContexts}`);
  console.log(`  Aggregates: ${status.aggregates}`);
  console.log(`  Domain Services: ${status.services}`);
  console.log(`  Domain Events: ${status.events}`);
  
  // Show workflow progress
  const progress = workflow.getProgress();
  console.log(`\nWorkflow Progress:`);
  console.log(`  Total Steps: ${progress.total}`);
  console.log(`  Completed: ${progress.completed}`);
  console.log(`  In Progress: ${progress.inProgress}`);
  console.log(`  Overall: ${progress.percentage}%`);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 7: MULTILINGUAL DOCUMENTATION
  // ═══════════════════════════════════════════════════════════════
  
  console.log('\n🌍 Phase 7: Multilingual Documentation\n');
  
  const languages = [SupportedLanguage.EN, SupportedLanguage.RU, SupportedLanguage.JA, SupportedLanguage.ZH_CN];
  
  console.log('Generated documentation in multiple languages:');
  for (const lang of languages) {
    console.log(`\n  ${lang}:`);
    console.log(`    ${catalogContext.name.get(lang)}: ${catalogContext.description.get(lang)}`);
    console.log(`    - ${productAggregate.name.get(lang)}: ${productAggregate.description.get(lang)}`);
  }
}

/**
 * Example: Using DDD with Commands and Queries
 */
async function runCommandHandlerExample() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     DDD Command Handler Example                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  const { CommandBus } = await import('../src/domain/application/command-handler.js');
  
  // Create command bus
  const commandBus = new CommandBus(logger);
  
  // Example command
  const createProductCommand = {
    id: 'cmd-001',
    timestamp: new Date(),
    language: SupportedLanguage.EN,
    name: {
      [SupportedLanguage.EN]: 'iPhone 15 Pro',
      [SupportedLanguage.RU]: 'iPhone 15 Pro',
      [SupportedLanguage.JA]: 'iPhone 15 Pro',
      [SupportedLanguage.ZH_CN]: 'iPhone 15 Pro',
    },
    description: {
      [SupportedLanguage.EN]: 'Latest Apple smartphone',
      [SupportedLanguage.RU]: 'Последний смартфон Apple',
      [SupportedLanguage.JA]: '最新のAppleスマートフォン',
      [SupportedLanguage.ZH_CN]: '最新的苹果智能手机',
    },
    properties: {
      price: 999,
      inventory: 100,
      category: 'electronics',
    },
  };
  
  console.log('Executing command:', createProductCommand.id);
  console.log(`  Product: ${createProductCommand.name[SupportedLanguage.EN]}`);
  console.log(`  Language: ${createProductCommand.language}`);
  
  // In a real implementation, you would register handlers and execute
  // const result = await commandBus.execute(createProductCommand);
  
  console.log('\n✅ Command would be processed through the command bus');
  console.log('   - Validate command');
  console.log('   - Create aggregate');
  console.log('   - Apply business rules');
  console.log('   - Publish domain events');
  console.log('   - Persist to repository');
}

/**
 * Main function
 */
async function main() {
  console.log('\n🌍 Claude Flow Multilang - DDD Development Examples\n');
  
  try {
    // Run the complete DDD workflow
    await runDDDDevelopmentWorkflow();
    
    // Run command handler example
    await runCommandHandlerExample();
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     DDD Development Examples Completed!                ║');
    console.log('║     Ready for Domain-Driven Development                ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('Error running DDD examples:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  runDDDDevelopmentWorkflow,
  runCommandHandlerExample,
};