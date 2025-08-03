#!/usr/bin/env node

/**
 * Claude Flow Multilang - DDD Example (JavaScript version)
 * Simple example that can run without TypeScript
 */

// Mock implementations for demonstration
class Logger {
  info(message, meta) {
    console.log(`[INFO] ${message}`, meta || '');
  }
  
  error(message, error) {
    console.error(`[ERROR] ${message}`, error || '');
  }
  
  warn(message, meta) {
    console.warn(`[WARN] ${message}`, meta || '');
  }
  
  debug(message, meta) {
    console.log(`[DEBUG] ${message}`, meta || '');
  }
  
  async configure() {
    // No configuration needed for simple logger
  }
}

class MultilingualString {
  constructor(translations) {
    this.translations = translations;
  }
  
  get(language) {
    return this.translations[language] || this.translations['en'] || '';
  }
}

class EntityId {
  static generate() {
    return {
      toString: () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }
}

// Simple DDD example
async function runDDDExample() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     DDD Example - E-Commerce System                    ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  const logger = new Logger();
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: DOMAIN MODELING
  // ═══════════════════════════════════════════════════════════════
  
  console.log('📋 Phase 1: Domain Modeling\n');
  
  // Create a product aggregate
  class Product {
    constructor(id, name, description, price, inventory, category) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.price = price;
      this.inventory = inventory;
      this.category = category;
      this.status = 'active';
      this.domainEvents = [];
    }
    
    updatePrice(newPrice) {
      if (newPrice <= 0) {
        throw new Error('Price must be positive');
      }
      if (this.status === 'discontinued') {
        throw new Error('Cannot update price of discontinued product');
      }
      
      const oldPrice = this.price;
      this.price = newPrice;
      
      this.domainEvents.push({
        eventType: 'PriceUpdated',
        aggregateId: this.id.toString(),
        data: { oldPrice, newPrice },
        timestamp: new Date()
      });
      
      logger.info('Price updated', { productId: this.id.toString(), oldPrice, newPrice });
    }
    
    adjustInventory(quantity, reason) {
      const newInventory = this.inventory + quantity;
      if (newInventory < 0) {
        throw new Error('Inventory cannot be negative');
      }
      
      this.inventory = newInventory;
      
      this.domainEvents.push({
        eventType: 'InventoryAdjusted',
        aggregateId: this.id.toString(),
        data: { quantity, reason, newInventory },
        timestamp: new Date()
      });
      
      logger.info('Inventory adjusted', { 
        productId: this.id.toString(), 
        quantity, 
        reason, 
        newInventory 
      });
    }
  }
  
  // Create a product
  const product = new Product(
    EntityId.generate(),
    new MultilingualString({
      en: 'MacBook Pro M3',
      ru: 'MacBook Pro M3',
      ja: 'MacBook Pro M3',
      zh_cn: 'MacBook Pro M3'
    }),
    new MultilingualString({
      en: 'Latest Apple laptop with M3 chip',
      ru: 'Последний ноутбук Apple с чипом M3',
      ja: 'M3チップ搭載の最新Appleノートパソコン',
      zh_cn: '搭载M3芯片的最新苹果笔记本电脑'
    }),
    1999,
    50,
    'electronics'
  );
  
  console.log('✅ Product created:');
  console.log(`   ID: ${product.id.toString()}`);
  console.log(`   Name: ${product.name.get('en')}`);
  console.log(`   Price: $${product.price}`);
  console.log(`   Inventory: ${product.inventory}\n`);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: COMMAND EXECUTION
  // ═══════════════════════════════════════════════════════════════
  
  console.log('📦 Phase 2: Command Execution\n');
  
  // Command pattern
  class UpdatePriceCommand {
    constructor(productId, newPrice) {
      this.id = `cmd_${Date.now()}`;
      this.productId = productId;
      this.newPrice = newPrice;
      this.timestamp = new Date();
      this.type = 'UpdatePrice';
    }
  }
  
  class CommandHandler {
    async handle(command, product) {
      try {
        switch (command.type) {
          case 'UpdatePrice':
            product.updatePrice(command.newPrice);
            return {
              success: true,
              aggregateId: product.id.toString(),
              events: ['PriceUpdated']
            };
            
          case 'AdjustInventory':
            product.adjustInventory(command.quantity, command.reason);
            return {
              success: true,
              aggregateId: product.id.toString(),
              events: ['InventoryAdjusted']
            };
            
          default:
            throw new Error(`Unknown command type: ${command.type}`);
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  }
  
  const handler = new CommandHandler();
  
  // Execute price update command
  const priceCommand = new UpdatePriceCommand(product.id, 1799);
  console.log('Executing UpdatePrice command...');
  const priceResult = await handler.handle(priceCommand, product);
  
  if (priceResult.success) {
    console.log('✅ Price updated successfully');
    console.log(`   New price: $${product.price}`);
    console.log(`   Events: ${priceResult.events.join(', ')}\n`);
  }
  
  // Execute inventory adjustment
  const inventoryCommand = {
    id: `cmd_${Date.now()}`,
    type: 'AdjustInventory',
    productId: product.id,
    quantity: -5,
    reason: 'Sold 5 units',
    timestamp: new Date()
  };
  
  console.log('Executing AdjustInventory command...');
  const inventoryResult = await handler.handle(inventoryCommand, product);
  
  if (inventoryResult.success) {
    console.log('✅ Inventory adjusted successfully');
    console.log(`   New inventory: ${product.inventory}`);
    console.log(`   Events: ${inventoryResult.events.join(', ')}\n`);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: DOMAIN EVENTS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('📊 Phase 3: Domain Events\n');
  
  console.log('Domain events generated:');
  product.domainEvents.forEach((event, index) => {
    console.log(`  ${index + 1}. ${event.eventType}`);
    console.log(`     Aggregate: ${event.aggregateId}`);
    console.log(`     Data: ${JSON.stringify(event.data)}`);
    console.log(`     Time: ${event.timestamp.toISOString()}\n`);
  });
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: BOUNDED CONTEXTS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('🏗️ Phase 4: Bounded Contexts\n');
  
  const boundedContexts = {
    catalog: {
      name: new MultilingualString({
        en: 'Product Catalog',
        ru: 'Каталог продуктов',
        ja: '製品カタログ',
        zh_cn: '产品目录'
      }),
      aggregates: ['Product', 'Category', 'Price'],
      services: ['ProductService', 'InventoryService'],
      events: ['ProductCreated', 'PriceUpdated', 'InventoryAdjusted']
    },
    order: {
      name: new MultilingualString({
        en: 'Order Management',
        ru: 'Управление заказами',
        ja: '注文管理',
        zh_cn: '订单管理'
      }),
      aggregates: ['Order', 'OrderItem', 'Payment'],
      services: ['OrderService', 'PaymentService'],
      events: ['OrderCreated', 'OrderConfirmed', 'PaymentProcessed']
    }
  };
  
  console.log('Bounded Contexts:');
  Object.entries(boundedContexts).forEach(([key, context]) => {
    console.log(`\n  ${context.name.get('en')}:`);
    console.log(`    Aggregates: ${context.aggregates.join(', ')}`);
    console.log(`    Services: ${context.services.join(', ')}`);
    console.log(`    Events: ${context.events.join(', ')}`);
  });
  
  console.log('\n');
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: MULTILINGUAL SUPPORT
  // ═══════════════════════════════════════════════════════════════
  
  console.log('🌍 Phase 5: Multilingual Support\n');
  
  const languages = ['en', 'ru', 'ja', 'zh_cn'];
  
  console.log('Product name in different languages:');
  languages.forEach(lang => {
    console.log(`  [${lang}]: ${product.name.get(lang)}`);
  });
  
  console.log('\nProduct description in different languages:');
  languages.forEach(lang => {
    console.log(`  [${lang}]: ${product.description.get(lang)}`);
  });
  
  console.log('\nCatalog context name in different languages:');
  languages.forEach(lang => {
    console.log(`  [${lang}]: ${boundedContexts.catalog.name.get(lang)}`);
  });
}

// Main function
async function main() {
  console.log('\n🌍 Claude Flow Multilang - DDD Example (JavaScript)\n');
  
  try {
    await runDDDExample();
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     DDD Example Completed Successfully!                ║');
    console.log('║     Domain-Driven Design is fully integrated           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('Error running DDD example:', error);
    process.exit(1);
  }
}

// Run the example
main();