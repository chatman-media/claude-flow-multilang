/**
 * Claude Flow Multilang Framework - DDD Base Domain Models
 * Domain-Driven Design foundation for multilingual applications
 */

import { SupportedLanguage } from '../polyglot/types.js';

/**
 * Base Value Object
 */
export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}

/**
 * Multilingual Value Object
 */
export class MultilingualString extends ValueObject<Record<SupportedLanguage, string>> {
  constructor(values: Partial<Record<SupportedLanguage, string>>) {
    // Ensure at least English is provided
    if (!values[SupportedLanguage.EN]) {
      throw new Error('English translation is required for multilingual strings');
    }
    super(values as Record<SupportedLanguage, string>);
  }

  get(language: SupportedLanguage): string {
    return this.props[language] || this.props[SupportedLanguage.EN];
  }

  getAll(): Record<SupportedLanguage, string> {
    return { ...this.props };
  }

  translate(language: SupportedLanguage, value: string): MultilingualString {
    return new MultilingualString({
      ...this.props,
      [language]: value,
    });
  }
}

/**
 * Entity ID
 */
export class EntityId extends ValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.value;
  }

  static generate(): EntityId {
    return new EntityId(
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    );
  }
}

/**
 * Base Entity
 */
export abstract class Entity<T> {
  protected readonly _id: EntityId;
  protected props: T;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;

  constructor(props: T, id?: EntityId) {
    this._id = id || EntityId.generate();
    this.props = props;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): EntityId {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (this === entity) {
      return true;
    }
    return this._id.equals(entity._id);
  }

  protected updateTimestamp(): void {
    this._updatedAt = new Date();
  }
}

/**
 * Multilingual Entity
 */
export abstract class MultilingualEntity<T> extends Entity<T> {
  protected translations: Map<string, MultilingualString>;

  constructor(props: T, id?: EntityId) {
    super(props, id);
    this.translations = new Map();
  }

  setTranslation(key: string, value: MultilingualString): void {
    this.translations.set(key, value);
    this.updateTimestamp();
  }

  getTranslation(key: string, language: SupportedLanguage): string | undefined {
    const multiString = this.translations.get(key);
    return multiString?.get(language);
  }

  getAllTranslations(): Map<string, MultilingualString> {
    return new Map(this.translations);
  }
}

/**
 * Aggregate Root
 */
export abstract class AggregateRoot<T> extends MultilingualEntity<T> {
  private _domainEvents: DomainEvent[] = [];
  private _version: number = 0;

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  get version(): number {
    return this._version;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  incrementVersion(): void {
    this._version++;
    this.updateTimestamp();
  }

  markChangesAsCommitted(): void {
    this._domainEvents = [];
  }
}

/**
 * Domain Event
 */
export abstract class DomainEvent {
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly eventVersion: number;
  readonly eventType: string;

  constructor(aggregateId: string, eventType: string) {
    this.occurredOn = new Date();
    this.aggregateId = aggregateId;
    this.eventVersion = 1;
    this.eventType = eventType;
  }

  abstract toJSON(): Record<string, any>;
}

/**
 * Multilingual Domain Event
 */
export abstract class MultilingualDomainEvent extends DomainEvent {
  protected descriptions: MultilingualString;

  constructor(
    aggregateId: string,
    eventType: string,
    descriptions: Partial<Record<SupportedLanguage, string>>,
  ) {
    super(aggregateId, eventType);
    this.descriptions = new MultilingualString(descriptions);
  }

  getDescription(language: SupportedLanguage): string {
    return this.descriptions.get(language);
  }

  toJSON(): Record<string, any> {
    return {
      occurredOn: this.occurredOn,
      aggregateId: this.aggregateId,
      eventVersion: this.eventVersion,
      eventType: this.eventType,
      descriptions: this.descriptions.getAll(),
    };
  }
}

/**
 * Repository Interface
 */
export interface IRepository<T extends AggregateRoot<any>> {
  save(entity: T): Promise<void>;
  findById(id: EntityId): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: EntityId): Promise<void>;
  exists(id: EntityId): Promise<boolean>;
}

/**
 * Multilingual Repository Interface
 */
export interface IMultilingualRepository<T extends AggregateRoot<any>> extends IRepository<T> {
  findByLanguage(language: SupportedLanguage): Promise<T[]>;
  searchTranslations(query: string, language: SupportedLanguage): Promise<T[]>;
}

/**
 * Specification Pattern
 */
export abstract class Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>,
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }
}

class OrSpecification<T> extends Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>,
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }
}

class NotSpecification<T> extends Specification<T> {
  constructor(private spec: Specification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
}

/**
 * Domain Service
 */
export abstract class DomainService {
  protected readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}

/**
 * Multilingual Domain Service
 */
export abstract class MultilingualDomainService extends DomainService {
  protected supportedLanguages: Set<SupportedLanguage>;

  constructor(name: string, supportedLanguages?: SupportedLanguage[]) {
    super(name);
    this.supportedLanguages = new Set(
      supportedLanguages || Object.values(SupportedLanguage),
    );
  }

  isLanguageSupported(language: SupportedLanguage): boolean {
    return this.supportedLanguages.has(language);
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return Array.from(this.supportedLanguages);
  }
}