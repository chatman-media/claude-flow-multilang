/**
 * Claude Flow Multilang Framework - Application Layer
 * Command handlers for DDD application services
 */

import { SupportedLanguage } from '../../polyglot/types.js';
import { ILogger } from '../../core/logger.js';
import { AggregateRoot, EntityId } from '../base-domain.js';
import { IMultilingualRepository } from '../base-domain.js';

/**
 * Base command interface
 */
export interface ICommand {
  id: string;
  timestamp: Date;
  userId?: string;
  language: SupportedLanguage;
  metadata?: Record<string, any>;
}

/**
 * Command result
 */
export interface ICommandResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  aggregateId?: string;
  version?: number;
  events?: string[];
}

/**
 * Command handler interface
 */
export interface ICommandHandler<TCommand extends ICommand, TResult = any> {
  handle(command: TCommand): Promise<ICommandResult<TResult>>;
  canHandle(command: ICommand): boolean;
}

/**
 * Base command handler
 */
export abstract class CommandHandler<
  TCommand extends ICommand,
  TAggregate extends AggregateRoot<any>,
  TResult = any
> implements ICommandHandler<TCommand, TResult> {
  
  constructor(
    protected repository: IMultilingualRepository<TAggregate>,
    protected logger: ILogger,
  ) {}
  
  abstract handle(command: TCommand): Promise<ICommandResult<TResult>>;
  
  abstract canHandle(command: ICommand): boolean;
  
  /**
   * Execute command with transaction support
   */
  protected async executeWithTransaction<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    // In real implementation, wrap in database transaction
    try {
      return await operation();
    } catch (error) {
      this.logger.error('Command execution failed', error);
      throw error;
    }
  }
  
  /**
   * Publish domain events
   */
  protected async publishEvents(aggregate: TAggregate): Promise<void> {
    const events = aggregate.domainEvents;
    
    for (const event of events) {
      this.logger.info('Publishing domain event', {
        type: event.eventType,
        aggregateId: event.aggregateId,
      });
      // In real implementation, publish to event bus
    }
    
    aggregate.markChangesAsCommitted();
  }
  
  /**
   * Create success result
   */
  protected successResult<T>(
    data: T,
    aggregateId?: string,
    events?: string[],
  ): ICommandResult<T> {
    return {
      success: true,
      data,
      aggregateId,
      events,
    };
  }
  
  /**
   * Create error result
   */
  protected errorResult(error: string): ICommandResult<TResult> {
    return {
      success: false,
      error,
    };
  }
}

/**
 * Create aggregate command
 */
export interface ICreateCommand extends ICommand {
  name: Partial<Record<SupportedLanguage, string>>;
  description: Partial<Record<SupportedLanguage, string>>;
  properties?: Record<string, any>;
}

/**
 * Update aggregate command
 */
export interface IUpdateCommand extends ICommand {
  aggregateId: string;
  changes: Record<string, any>;
  version?: number;
}

/**
 * Delete aggregate command
 */
export interface IDeleteCommand extends ICommand {
  aggregateId: string;
  reason?: string;
}

/**
 * Command bus for routing commands to handlers
 */
export class CommandBus {
  private handlers: Map<string, ICommandHandler<any, any>> = new Map();
  
  constructor(private logger: ILogger) {}
  
  /**
   * Register command handler
   */
  register<TCommand extends ICommand>(
    commandType: string,
    handler: ICommandHandler<TCommand, any>,
  ): void {
    this.handlers.set(commandType, handler);
    this.logger.info(`Registered handler for command: ${commandType}`);
  }
  
  /**
   * Execute command
   */
  async execute<TResult = any>(
    command: ICommand,
  ): Promise<ICommandResult<TResult>> {
    const commandType = command.constructor.name;
    
    // Find handler that can handle this command
    let handler: ICommandHandler<any, any> | undefined;
    
    for (const [type, h] of this.handlers.entries()) {
      if (h.canHandle(command)) {
        handler = h;
        break;
      }
    }
    
    if (!handler) {
      this.logger.error(`No handler found for command: ${commandType}`);
      return {
        success: false,
        error: `No handler registered for command: ${commandType}`,
      };
    }
    
    try {
      this.logger.info(`Executing command: ${commandType}`, {
        commandId: command.id,
        language: command.language,
      });
      
      const result = await handler.handle(command);
      
      if (result.success) {
        this.logger.info(`Command executed successfully: ${commandType}`);
      } else {
        this.logger.error(`Command execution failed: ${commandType}`, {
          error: result.error,
        });
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Command execution error: ${commandType}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Execute multiple commands in sequence
   */
  async executeSequence(
    commands: ICommand[],
  ): Promise<ICommandResult[]> {
    const results: ICommandResult[] = [];
    
    for (const command of commands) {
      const result = await this.execute(command);
      results.push(result);
      
      // Stop on first failure
      if (!result.success) {
        break;
      }
    }
    
    return results;
  }
  
  /**
   * Execute multiple commands in parallel
   */
  async executeParallel(
    commands: ICommand[],
  ): Promise<ICommandResult[]> {
    return Promise.all(commands.map(cmd => this.execute(cmd)));
  }
}