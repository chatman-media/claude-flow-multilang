/**
 * Claude Flow Multilang Framework - Polyglot Types
 * Core type definitions for multilingual AI agent orchestration
 */

/**
 * Supported languages in Claude Flow Multilang v1.0
 */
export enum SupportedLanguage {
  EN = 'en',       // English (base language)
  RU = 'ru',       // Русский
  ZH_CN = 'zh-cn', // 简体中文
  ZH_TW = 'zh-tw', // 繁體中文
  JA = 'ja',       // 日本語
  KO = 'ko',       // 한국어
  DE = 'de',       // Deutsch
  FR = 'fr',       // Français
  ES = 'es',       // Español
  PT = 'pt',       // Português
  TR = 'tr',       // Türkçe
  TH = 'th',       // ไทย
  IT = 'it',       // Italiano
  HI = 'hi',       // हिन्दी
}

/**
 * Language detection result
 */
export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number;
  alternatives: Array<{
    language: SupportedLanguage;
    confidence: number;
  }>;
  script?: 'latin' | 'cyrillic' | 'cjk' | 'arabic' | 'devanagari';
}

/**
 * Cultural context for language-aware processing
 */
export interface CulturalContext {
  language: SupportedLanguage;
  region?: string;
  timezone?: string;
  dateFormat: string;
  numberFormat: string;
  currencyFormat?: string;
  formalityLevel: 'informal' | 'neutral' | 'formal' | 'very-formal';
  businessEtiquette?: {
    greetingStyle: string;
    communicationStyle: 'direct' | 'indirect' | 'contextual';
    decisionMaking: 'individual' | 'consensus' | 'hierarchical';
  };
  writingDirection: 'ltr' | 'rtl';
  pluralizationRules?: Record<string, any>;
}

/**
 * Translation context with metadata
 */
export interface TranslationContext {
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  domain?: string; // Technical, business, casual, etc.
  preserveFormatting?: boolean;
  culturalAdaptation?: boolean;
  glossary?: Record<string, string>;
  tone?: 'professional' | 'casual' | 'technical' | 'friendly';
}

/**
 * Polyglot agent capabilities
 */
export interface PolyglotCapabilities {
  languages: SupportedLanguage[];
  primaryLanguage: SupportedLanguage;
  translationPairs: Array<[SupportedLanguage, SupportedLanguage]>;
  culturalAwareness: boolean;
  domainExpertise: string[];
  realTimeTranslation: boolean;
  documentGeneration: boolean;
}

/**
 * Multilingual command structure
 */
export interface MultilingualCommand {
  rawInput: string;
  detectedLanguage: SupportedLanguage;
  normalizedCommand: string;
  intent: string;
  entities: Record<string, any>;
  culturalContext?: CulturalContext;
  confidence: number;
}

/**
 * Documentation synchronization metadata
 */
export interface DocSyncMetadata {
  baseLanguage: SupportedLanguage;
  targetLanguages: SupportedLanguage[];
  lastSyncTimestamp: Date;
  syncStatus: 'synced' | 'outdated' | 'in-progress' | 'failed';
  versions: Record<SupportedLanguage, string>;
  autoSync: boolean;
}

/**
 * Language-specific agent configuration
 */
export interface LanguageAgentConfig {
  language: SupportedLanguage;
  modelPreferences?: {
    provider?: string;
    model?: string;
    temperature?: number;
  };
  responseTemplate?: string;
  culturalRules?: Partial<CulturalContext>;
  specializedVocabulary?: string[];
  domainKnowledge?: string[];
}

/**
 * Polyglot memory entry
 */
export interface PolyglotMemoryEntry {
  id: string;
  timestamp: Date;
  language: SupportedLanguage;
  originalContent: string;
  translations: Partial<Record<SupportedLanguage, string>>;
  context: any;
  tags: string[];
  culturalNotes?: string;
}

/**
 * Language model metrics
 */
export interface LanguageMetrics {
  language: SupportedLanguage;
  totalRequests: number;
  successfulTranslations: number;
  failedTranslations: number;
  averageConfidence: number;
  averageLatency: number;
  culturalAdaptations: number;
  cacheHitRate: number;
}

/**
 * DDD integration types for multilingual domain modeling
 */
export interface MultilingualDomainModel {
  aggregateId: string;
  aggregateName: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  ubiquitousLanguage: Record<string, Record<SupportedLanguage, string>>;
  boundedContext: string;
  domainEvents: Array<{
    name: string;
    translations: Record<SupportedLanguage, string>;
  }>;
}

/**
 * Code generation context from documentation
 */
export interface CodeGenerationContext {
  sourceDoc: {
    language: SupportedLanguage;
    content: string;
    format: 'markdown' | 'json' | 'yaml' | 'xml';
  };
  targetLanguage: 'typescript' | 'javascript' | 'python' | 'java' | 'go';
  framework?: string;
  patterns: string[]; // DDD, MVC, etc.
  includeTests: boolean;
  includeComments: boolean;
  commentLanguage: SupportedLanguage;
}