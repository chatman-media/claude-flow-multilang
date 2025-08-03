/**
 * Claude Flow Multilang - DDD Commands Example
 * Shows complete DDD workflow with commands and handlers
 */

import { DDDDevelopmentService } from '../src/domain/application/ddd-development-service.js';
import { CommandBus, ICreateCommand } from '../src/domain/application/command-handler.js';
import { 
  CreateProductHandler, 
  UpdateProductHandler,
  ICreateProductCommand,
  IUpdateProductCommand,
  Product,
  IProductRepository,
} from '../src/domain/application/create-product-handler.js';
import { SupportedLanguage } from '../src/polyglot/types.js';
import { PolyglotAgent } from '../src/polyglot/polyglot-agent.js';
import { ConsoleLogger } from '../src/core/logger.js';
import { EntityId, MultilingualString } from '../src/domain/base-domain.js';

const logger = new ConsoleLogger('ddd-commands');

/**
 * Mock product repository for the example
 */
class MockProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  async save(entity: Product): Promise<void> {
    this.products.set(entity.id.toString(), entity);
  }

  async findById(id: EntityId): Promise<Product | null> {
    return this.products.get(id.toString()) || null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async delete(id: EntityId): Promise<void> {
    this.products.delete(id.toString());
  }

  async findByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => p.category === category);
  }

  async findByPriceRange(min: number, max: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => p.price >= min && p.price <= max);
  }

  async search(query: string, language: SupportedLanguage): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => {
        const name = p.name.get(language);
        const desc = p.description.get(language);
        return name.includes(query) || desc.includes(query);
      });
  }
}

/**
 * Example: Complete DDD workflow with commands
 */
async function runDDDCommandsExample() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     DDD Commands and Handlers Example                  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  // Initialize components
  const agent = new PolyglotAgent(
    'DDD Command Processor',
    ['command-processing', 'validation'],
    logger,
    SupportedLanguage.EN,
  );
  
  const dddService = new DDDDevelopmentService(logger, agent);
  const repository = new MockProductRepository();
  const commandBus = new CommandBus(logger);
  
  // Register command handlers
  const createHandler = new CreateProductHandler(repository, logger);
  const updateHandler = new UpdateProductHandler(repository, logger);
  
  commandBus.register('CreateProduct', createHandler);
  commandBus.register('UpdateProduct', updateHandler);
  
  // Also register in DDD service
  dddService.registerCommandHandler('CreateProduct', createHandler);
  dddService.registerCommandHandler('UpdateProduct', updateHandler);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: CREATE PRODUCTS USING COMMANDS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('📋 Phase 1: Creating Products with Commands\n');
  
  // Create product command
  const createCommand: ICreateProductCommand = {
    type: 'CreateProduct',
    id: 'cmd-001',
    timestamp: new Date(),
    language: SupportedLanguage.EN,
    name: {
      [SupportedLanguage.EN]: 'MacBook Pro M3',
      [SupportedLanguage.RU]: 'MacBook Pro M3',
      [SupportedLanguage.JA]: 'MacBook Pro M3',
      [SupportedLanguage.ZH_CN]: 'MacBook Pro M3',
    },
    description: {
      [SupportedLanguage.EN]: 'Latest Apple laptop with M3 chip',
      [SupportedLanguage.RU]: 'Последний ноутбук Apple с чипом M3',
      [SupportedLanguage.JA]: 'M3チップ搭載の最新Appleノートパソコン',
      [SupportedLanguage.ZH_CN]: '搭载M3芯片的最新苹果笔记本电脑',
    },
    price: 1999,
    inventory: 50,
    category: 'electronics',
  };
  
  console.log('Executing CreateProduct command...');
  const createResult = await dddService.executeCommand(createCommand);
  
  if (createResult.success) {
    console.log('✅ Product created successfully');
    console.log(`   ID: ${createResult.aggregateId}`);
    console.log(`   Events: ${createResult.events?.join(', ')}`);
  } else {
    console.log(`❌ Failed to create product: ${createResult.error}`);
  }
  
  // Create another product
  const createCommand2: ICreateProductCommand = {
    type: 'CreateProduct',
    id: 'cmd-002',
    timestamp: new Date(),
    language: SupportedLanguage.RU,
    name: {
      [SupportedLanguage.EN]: 'iPhone 15 Pro',
      [SupportedLanguage.RU]: 'iPhone 15 Pro',
      [SupportedLanguage.JA]: 'iPhone 15 Pro',
      [SupportedLanguage.ZH_CN]: 'iPhone 15 Pro',
    },
    description: {
      [SupportedLanguage.EN]: 'Premium smartphone with titanium design',
      [SupportedLanguage.RU]: 'Премиум смартфон с титановым дизайном',
      [SupportedLanguage.JA]: 'チタニウムデザインのプレミアムスマートフォン',
      [SupportedLanguage.ZH_CN]: '钛金属设计的高端智能手机',
    },
    price: 999,
    inventory: 100,
    category: 'electronics',
  };
  
  const createResult2 = await commandBus.execute(createCommand2);
  console.log(`✅ Second product created: ${createResult2.success}\n`);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: UPDATE PRODUCTS USING COMMANDS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('📦 Phase 2: Updating Products with Commands\n');
  
  if (createResult.aggregateId) {
    const updateCommand: IUpdateProductCommand = {
      type: 'UpdateProduct',
      id: 'cmd-003',
      timestamp: new Date(),
      language: SupportedLanguage.EN,
      productId: createResult.aggregateId,
      updates: {
        price: 1799, // Discount
        inventory: { quantity: -5, reason: 'Sold 5 units' },
      },
    };
    
    console.log('Executing UpdateProduct command...');
    const updateResult = await dddService.executeCommand(updateCommand);
    
    if (updateResult.success) {
      console.log('✅ Product updated successfully');
      console.log(`   Events: ${updateResult.events?.join(', ')}`);
    } else {
      console.log(`❌ Failed to update product: ${updateResult.error}`);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: COMMAND SEQUENCES
  // ═══════════════════════════════════════════════════════════════
  
  console.log('\n🔄 Phase 3: Command Sequences\n');
  
  const commandSequence = [
    {
      type: 'CreateProduct',
      id: 'cmd-seq-1',
      timestamp: new Date(),
      language: SupportedLanguage.JA,
      name: {
        [SupportedLanguage.EN]: 'iPad Pro',
        [SupportedLanguage.JA]: 'iPad Pro',
      },
      description: {
        [SupportedLanguage.EN]: 'Professional tablet',
        [SupportedLanguage.JA]: 'プロフェッショナルタブレット',
      },
      price: 799,
      inventory: 30,
      category: 'tablets',
    } as ICreateProductCommand,
    {
      type: 'CreateProduct',
      id: 'cmd-seq-2',
      timestamp: new Date(),
      language: SupportedLanguage.ZH_CN,
      name: {
        [SupportedLanguage.EN]: 'AirPods Pro',
        [SupportedLanguage.ZH_CN]: 'AirPods Pro',
      },
      description: {
        [SupportedLanguage.EN]: 'Wireless earbuds',
        [SupportedLanguage.ZH_CN]: '无线耳机',
      },
      price: 249,
      inventory: 200,
      category: 'accessories',
    } as ICreateProductCommand,
  ];
  
  console.log('Executing command sequence...');
  const sequenceResults = await dddService.executeCommandSequence(commandSequence);
  
  console.log(`Sequence results:`);
  sequenceResults.forEach((result, index) => {
    console.log(`  Command ${index + 1}: ${result.success ? '✅' : '❌'}`);
  });
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: QUERY PRODUCTS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('\n🔍 Phase 4: Querying Products\n');
  
  const allProducts = await repository.findAll();
  console.log(`Total products created: ${allProducts.length}`);
  
  const electronics = await repository.findByCategory('electronics');
  console.log(`Electronics products: ${electronics.length}`);
  
  const affordableProducts = await repository.findByPriceRange(0, 1000);
  console.log(`Products under $1000: ${affordableProducts.length}`);
  
  // Multilingual search
  const searchResults = await repository.search('Pro', SupportedLanguage.EN);
  console.log(`Products with "Pro" in name: ${searchResults.length}`);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: DDD WORKFLOW WITH COMMANDS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('\n🏗️ Phase 5: Complete DDD Workflow\n');
  
  // Create bounded context command
  const createContextCommand: ICreateCommand = {
    type: 'CreateBoundedContext',
    id: 'cmd-ctx-001',
    timestamp: new Date(),
    language: SupportedLanguage.EN,
    name: {
      [SupportedLanguage.EN]: 'Catalog Context',
      [SupportedLanguage.RU]: 'Контекст каталога',
      [SupportedLanguage.JA]: 'カタログコンテキスト',
      [SupportedLanguage.ZH_CN]: '目录上下文',
    },
    description: {
      [SupportedLanguage.EN]: 'Product catalog management',
      [SupportedLanguage.RU]: 'Управление каталогом продуктов',
      [SupportedLanguage.JA]: '製品カタログ管理',
      [SupportedLanguage.ZH_CN]: '产品目录管理',
    },
    properties: {
      team: 'Catalog Team',
    },
  };
  
  const contextResult = await dddService.executeCommand(createContextCommand);
  
  if (contextResult.success) {
    console.log('✅ Bounded context created');
    
    // Add aggregate command
    const addAggregateCommand = {
      type: 'AddAggregate',
      id: 'cmd-agg-001',
      timestamp: new Date(),
      language: SupportedLanguage.EN,
      contextId: contextResult.data.id,
      aggregate: {
        id: 'product-aggregate',
        name: new MultilingualString({
          [SupportedLanguage.EN]: 'Product',
          [SupportedLanguage.RU]: 'Продукт',
        }),
        description: new MultilingualString({
          [SupportedLanguage.EN]: 'Product aggregate',
          [SupportedLanguage.RU]: 'Агрегат продукта',
        }),
        properties: [],
        methods: [],
        events: ['ProductCreated', 'PriceUpdated'],
        invariants: ['Price must be positive'],
      },
    };
    
    const aggregateResult = await dddService.executeCommand(addAggregateCommand);
    console.log(`✅ Aggregate added: ${aggregateResult.success}`);
    
    // Generate code command
    const generateCodeCommand = {
      type: 'GenerateCode',
      id: 'cmd-gen-001',
      timestamp: new Date(),
      language: SupportedLanguage.EN,
      contextId: contextResult.data.id,
      options: {
        language: 'typescript',
        includeTests: true,
        includeRepositories: true,
      },
    };
    
    const codeResult = await dddService.executeCommand(generateCodeCommand);
    
    if (codeResult.success) {
      console.log(`✅ Code generated: ${codeResult.data.files.length} files`);
      codeResult.data.files.forEach(([name]: [string, string]) => {
        console.log(`   📄 ${name}`);
      });
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: STATUS AND METRICS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('\n📊 Phase 6: Status and Metrics\n');
  
  const status = dddService.getStatus();
  console.log('DDD Service Status:');
  console.log(`  Phase: ${status.phase}`);
  console.log(`  Bounded Contexts: ${status.boundedContexts}`);
  console.log(`  Aggregates: ${status.aggregates}`);
  console.log(`  Products in Repository: ${allProducts.length}`);
  console.log(`  Command Handlers Registered: 2`);
}

/**
 * Main function
 */
async function main() {
  console.log('\n🌍 Claude Flow Multilang - DDD Commands Example\n');
  
  try {
    await runDDDCommandsExample();
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     DDD Commands Example Completed Successfully!       ║');
    console.log('║     Commands and Handlers are fully integrated         ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('Error running DDD commands example:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  runDDDCommandsExample,
};