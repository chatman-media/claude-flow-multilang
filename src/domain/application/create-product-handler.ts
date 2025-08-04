/**
 * Claude Flow Multilang - Example Command Handler
 * Creates products using DDD patterns
 */

import { CommandHandler, ICreateCommand, ICommandResult } from './command-handler.js';
import { SupportedLanguage } from '../../polyglot/types.js';
import { ILogger } from '../../core/logger.js';
import { EntityId, MultilingualString } from '../base-domain.js';
import { IMultilingualRepository } from '../base-domain.js';

/**
 * Product aggregate for the example
 */
export class Product {
  constructor(
    public readonly id: EntityId,
    public name: MultilingualString,
    public description: MultilingualString,
    public price: number,
    public inventory: number,
    public category: string,
    public status: 'active' | 'discontinued' = 'active',
  ) {}

  public domainEvents: any[] = [];

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be positive');
    }
    if (this.status === 'discontinued') {
      throw new Error('Cannot update price of discontinued product');
    }
    this.price = newPrice;
    this.domainEvents.push({
      eventType: 'PriceUpdated',
      aggregateId: this.id.toString(),
      data: { oldPrice: this.price, newPrice },
    });
  }

  adjustInventory(quantity: number, reason: string): void {
    const newInventory = this.inventory + quantity;
    if (newInventory < 0) {
      throw new Error('Inventory cannot be negative');
    }
    this.inventory = newInventory;
    this.domainEvents.push({
      eventType: 'InventoryAdjusted',
      aggregateId: this.id.toString(),
      data: { quantity, reason, newInventory },
    });
  }

  markChangesAsCommitted(): void {
    this.domainEvents = [];
  }
}

/**
 * Create product command
 */
export interface ICreateProductCommand extends ICreateCommand {
  price: number;
  inventory: number;
  category: string;
}

/**
 * Product repository interface
 */
export interface IProductRepository extends IMultilingualRepository<Product> {
  findByCategory(category: string): Promise<Product[]>;
  findByPriceRange(min: number, max: number): Promise<Product[]>;
}

/**
 * Create product command handler
 */
export class CreateProductHandler extends CommandHandler<ICreateProductCommand, Product> {
  constructor(
    repository: IProductRepository,
    logger: ILogger,
  ) {
    super(repository, logger);
  }

  async handle(command: ICreateProductCommand): Promise<ICommandResult<Product>> {
    try {
      // Validate command
      if (!command.name || Object.keys(command.name).length === 0) {
        return this.errorResult('Product name is required');
      }

      if (command.price <= 0) {
        return this.errorResult('Product price must be positive');
      }

      if (command.inventory < 0) {
        return this.errorResult('Product inventory cannot be negative');
      }

      // Create product aggregate
      const product = new Product(
        EntityId.generate(),
        new MultilingualString(command.name),
        new MultilingualString(command.description),
        command.price,
        command.inventory,
        command.category,
      );

      // Add creation event
      product.domainEvents.push({
        eventType: 'ProductCreated',
        aggregateId: product.id.toString(),
        data: {
          name: command.name,
          price: command.price,
          inventory: command.inventory,
          category: command.category,
        },
      });

      // Save to repository
      await this.executeWithTransaction(async () => {
        await this.repository.save(product);
        await this.publishEvents(product);
      });

      this.logger.info('Product created successfully', {
        id: product.id.toString(),
        name: product.name.get(command.language),
      });

      return this.successResult(
        product,
        product.id.toString(),
        ['ProductCreated'],
      );
    } catch (error) {
      this.logger.error('Failed to create product', error);
      return this.errorResult(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  canHandle(command: any): boolean {
    return command.type === 'CreateProduct' || 
           command.constructor.name === 'CreateProductCommand';
  }
}

/**
 * Update product command
 */
export interface IUpdateProductCommand {
  id: string;
  timestamp: Date;
  language: SupportedLanguage;
  productId: string;
  updates: {
    price?: number;
    inventory?: { quantity: number; reason: string };
    status?: 'active' | 'discontinued';
  };
}

/**
 * Update product command handler
 */
export class UpdateProductHandler extends CommandHandler<IUpdateProductCommand, Product> {
  constructor(
    repository: IProductRepository,
    logger: ILogger,
  ) {
    super(repository, logger);
  }

  async handle(command: IUpdateProductCommand): Promise<ICommandResult<Product>> {
    try {
      // Find product
      const product = await this.repository.findById(new EntityId(command.productId));
      if (!product) {
        return this.errorResult('Product not found');
      }

      // Apply updates
      await this.executeWithTransaction(async () => {
        if (command.updates.price !== undefined) {
          product.updatePrice(command.updates.price);
        }

        if (command.updates.inventory) {
          product.adjustInventory(
            command.updates.inventory.quantity,
            command.updates.inventory.reason,
          );
        }

        if (command.updates.status) {
          product.status = command.updates.status;
          product.domainEvents.push({
            eventType: 'ProductStatusChanged',
            aggregateId: product.id.toString(),
            data: { newStatus: command.updates.status },
          });
        }

        // Save changes
        await this.repository.save(product);
        await this.publishEvents(product);
      });

      return this.successResult(
        product,
        product.id.toString(),
        product.domainEvents.map(e => e.eventType),
      );
    } catch (error) {
      this.logger.error('Failed to update product', error);
      return this.errorResult(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  canHandle(command: any): boolean {
    return command.type === 'UpdateProduct' || 
           command.constructor.name === 'UpdateProductCommand';
  }
}