/**
 * Claude Flow Multilang Framework - Workflow Aggregate Example
 * Example DDD aggregate for multilingual workflow management
 */

import {
  AggregateRoot,
  EntityId,
  MultilingualString,
  MultilingualDomainEvent,
} from './base-domain.js';
import { SupportedLanguage } from '../polyglot/types.js';

/**
 * Workflow status enum
 */
export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Workflow step entity
 */
export class WorkflowStep {
  constructor(
    public readonly id: string,
    public readonly name: MultilingualString,
    public readonly description: MultilingualString,
    public readonly agentType: string,
    public readonly requiredCapabilities: string[],
    public status: 'pending' | 'in-progress' | 'completed' | 'failed' = 'pending',
    public readonly dependencies: string[] = [],
  ) {}

  markAsInProgress(): void {
    if (this.status !== 'pending') {
      throw new Error('Step can only be started from pending status');
    }
    this.status = 'in-progress';
  }

  markAsCompleted(): void {
    if (this.status !== 'in-progress') {
      throw new Error('Step can only be completed from in-progress status');
    }
    this.status = 'completed';
  }

  markAsFailed(): void {
    this.status = 'failed';
  }

  canStart(completedSteps: Set<string>): boolean {
    return this.dependencies.every(dep => completedSteps.has(dep));
  }
}

/**
 * Workflow properties
 */
interface WorkflowProps {
  name: MultilingualString;
  description: MultilingualString;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  targetLanguages: SupportedLanguage[];
  culturalAdaptation: boolean;
  autoTranslate: boolean;
  metadata: Record<string, any>;
}

/**
 * Workflow Created Event
 */
export class WorkflowCreatedEvent extends MultilingualDomainEvent {
  constructor(
    aggregateId: string,
    public readonly workflowName: Record<SupportedLanguage, string>,
    public readonly targetLanguages: SupportedLanguage[],
  ) {
    super(aggregateId, 'WorkflowCreated', {
      [SupportedLanguage.EN]: `Workflow "${workflowName[SupportedLanguage.EN]}" created`,
      [SupportedLanguage.RU]: `Рабочий процесс "${workflowName[SupportedLanguage.RU] || workflowName[SupportedLanguage.EN]}" создан`,
      [SupportedLanguage.JA]: `ワークフロー「${workflowName[SupportedLanguage.JA] || workflowName[SupportedLanguage.EN]}」が作成されました`,
      [SupportedLanguage.ZH_CN]: `工作流程"${workflowName[SupportedLanguage.ZH_CN] || workflowName[SupportedLanguage.EN]}"已创建`,
    });
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      workflowName: this.workflowName,
      targetLanguages: this.targetLanguages,
    };
  }
}

/**
 * Workflow Step Completed Event
 */
export class WorkflowStepCompletedEvent extends MultilingualDomainEvent {
  constructor(
    aggregateId: string,
    public readonly stepId: string,
    public readonly stepName: Record<SupportedLanguage, string>,
  ) {
    super(aggregateId, 'WorkflowStepCompleted', {
      [SupportedLanguage.EN]: `Step "${stepName[SupportedLanguage.EN]}" completed`,
      [SupportedLanguage.RU]: `Шаг "${stepName[SupportedLanguage.RU] || stepName[SupportedLanguage.EN]}" завершен`,
      [SupportedLanguage.JA]: `ステップ「${stepName[SupportedLanguage.JA] || stepName[SupportedLanguage.EN]}」が完了しました`,
      [SupportedLanguage.ZH_CN]: `步骤"${stepName[SupportedLanguage.ZH_CN] || stepName[SupportedLanguage.EN]}"已完成`,
    });
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      stepId: this.stepId,
      stepName: this.stepName,
    };
  }
}

/**
 * Workflow Aggregate Root
 */
export class WorkflowAggregate extends AggregateRoot<WorkflowProps> {
  private completedSteps: Set<string>;

  constructor(props: WorkflowProps, id?: EntityId) {
    super(props, id);
    this.completedSteps = new Set(
      props.steps.filter(s => s.status === 'completed').map(s => s.id),
    );
    
    // Set up translations for name and description
    this.setTranslation('name', props.name);
    this.setTranslation('description', props.description);
  }

  /**
   * Factory method to create a new workflow
   */
  static create(
    name: Partial<Record<SupportedLanguage, string>>,
    description: Partial<Record<SupportedLanguage, string>>,
    targetLanguages: SupportedLanguage[] = [SupportedLanguage.EN],
    options: {
      culturalAdaptation?: boolean;
      autoTranslate?: boolean;
    } = {},
  ): WorkflowAggregate {
    const workflow = new WorkflowAggregate({
      name: new MultilingualString(name),
      description: new MultilingualString(description),
      status: WorkflowStatus.DRAFT,
      steps: [],
      targetLanguages,
      culturalAdaptation: options.culturalAdaptation ?? true,
      autoTranslate: options.autoTranslate ?? true,
      metadata: {},
    });
    
    workflow.addDomainEvent(
      new WorkflowCreatedEvent(
        workflow.id.toString(),
        name as Record<SupportedLanguage, string>,
        targetLanguages,
      ),
    );
    
    return workflow;
  }

  /**
   * Add a step to the workflow
   */
  addStep(
    name: Partial<Record<SupportedLanguage, string>>,
    description: Partial<Record<SupportedLanguage, string>>,
    agentType: string,
    requiredCapabilities: string[],
    dependencies: string[] = [],
  ): void {
    if (this.props.status !== WorkflowStatus.DRAFT) {
      throw new Error('Steps can only be added to draft workflows');
    }
    
    const stepId = `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const step = new WorkflowStep(
      stepId,
      new MultilingualString(name),
      new MultilingualString(description),
      agentType,
      requiredCapabilities,
      'pending',
      dependencies,
    );
    
    this.props.steps.push(step);
    this.incrementVersion();
  }

  /**
   * Activate the workflow
   */
  activate(): void {
    if (this.props.status !== WorkflowStatus.DRAFT) {
      throw new Error('Only draft workflows can be activated');
    }
    
    if (this.props.steps.length === 0) {
      throw new Error('Cannot activate workflow without steps');
    }
    
    this.props.status = WorkflowStatus.ACTIVE;
    this.incrementVersion();
  }

  /**
   * Start a workflow step
   */
  startStep(stepId: string): void {
    const step = this.props.steps.find(s => s.id === stepId);
    if (!step) {
      throw new Error(`Step ${stepId} not found`);
    }
    
    if (!step.canStart(this.completedSteps)) {
      throw new Error(`Step ${stepId} dependencies not met`);
    }
    
    step.markAsInProgress();
    this.incrementVersion();
  }

  /**
   * Complete a workflow step
   */
  completeStep(stepId: string): void {
    const step = this.props.steps.find(s => s.id === stepId);
    if (!step) {
      throw new Error(`Step ${stepId} not found`);
    }
    
    step.markAsCompleted();
    this.completedSteps.add(stepId);
    
    this.addDomainEvent(
      new WorkflowStepCompletedEvent(
        this.id.toString(),
        stepId,
        step.name.getAll(),
      ),
    );
    
    // Check if all steps are completed
    if (this.props.steps.every(s => s.status === 'completed')) {
      this.props.status = WorkflowStatus.COMPLETED;
    }
    
    this.incrementVersion();
  }

  /**
   * Get workflow name in specific language
   */
  getName(language: SupportedLanguage): string {
    return this.getTranslation('name', language) || 'Unnamed Workflow';
  }

  /**
   * Get workflow description in specific language
   */
  getDescription(language: SupportedLanguage): string {
    return this.getTranslation('description', language) || 'No description';
  }

  /**
   * Get next available steps
   */
  getNextSteps(): WorkflowStep[] {
    return this.props.steps.filter(
      step => step.status === 'pending' && step.canStart(this.completedSteps),
    );
  }

  /**
   * Get workflow progress
   */
  getProgress(): {
    total: number;
    completed: number;
    inProgress: number;
    failed: number;
    percentage: number;
  } {
    const total = this.props.steps.length;
    const completed = this.props.steps.filter(s => s.status === 'completed').length;
    const inProgress = this.props.steps.filter(s => s.status === 'in-progress').length;
    const failed = this.props.steps.filter(s => s.status === 'failed').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, inProgress, failed, percentage };
  }

  /**
   * Export workflow as JSON with translations
   */
  toMultilingualJSON(language?: SupportedLanguage): Record<string, any> {
    const targetLang = language || SupportedLanguage.EN;
    
    return {
      id: this.id.toString(),
      name: this.getName(targetLang),
      description: this.getDescription(targetLang),
      status: this.props.status,
      progress: this.getProgress(),
      steps: this.props.steps.map(step => ({
        id: step.id,
        name: step.name.get(targetLang),
        description: step.description.get(targetLang),
        status: step.status,
        agentType: step.agentType,
        requiredCapabilities: step.requiredCapabilities,
        dependencies: step.dependencies,
      })),
      targetLanguages: this.props.targetLanguages,
      culturalAdaptation: this.props.culturalAdaptation,
      autoTranslate: this.props.autoTranslate,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}