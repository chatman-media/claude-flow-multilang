/**
 * Claude Flow Multilang Framework - Language Manager
 * Core language detection, translation, and management system
 */

import {
  SupportedLanguage,
  LanguageDetectionResult,
  TranslationContext,
} from '../polyglot/types.js';
import { ILogger } from '../core/logger.js';

/**
 * Language patterns for detection
 */
const LANGUAGE_PATTERNS: Record<SupportedLanguage, RegExp[]> = {
  [SupportedLanguage.EN]: [
    /\b(the|and|or|but|in|on|at|to|for)\b/gi,
    /\b(is|are|was|were|been|being)\b/gi,
  ],
  [SupportedLanguage.RU]: [
    /[а-яА-ЯёЁ]+/g,
    /\b(и|или|но|в|на|для|с|по)\b/gi,
  ],
  [SupportedLanguage.ZH_CN]: [
    /[\u4e00-\u9fff]+/g,
    /[\u3400-\u4dbf]+/g,
  ],
  [SupportedLanguage.ZH_TW]: [
    /[\u4e00-\u9fff]+/g,
    /[\u3400-\u4dbf]+/g,
  ],
  [SupportedLanguage.JA]: [
    /[\u3040-\u309f]+/g, // Hiragana
    /[\u30a0-\u30ff]+/g, // Katakana
    /[\u4e00-\u9faf]+/g, // Kanji
  ],
  [SupportedLanguage.KO]: [
    /[\uac00-\ud7af]+/g, // Hangul syllables
    /[\u1100-\u11ff]+/g, // Hangul Jamo
  ],
  [SupportedLanguage.DE]: [
    /\b(der|die|das|und|oder|aber|in|auf|mit)\b/gi,
    /[äöüÄÖÜß]/g,
  ],
  [SupportedLanguage.FR]: [
    /\b(le|la|les|et|ou|mais|dans|sur|avec)\b/gi,
    /[àâçèéêëîïôùûüÿœæ]/gi,
  ],
  [SupportedLanguage.ES]: [
    /\b(el|la|los|las|y|o|pero|en|con)\b/gi,
    /[áéíóúñ¿¡]/gi,
  ],
  [SupportedLanguage.PT]: [
    /\b(o|a|os|as|e|ou|mas|em|com)\b/gi,
    /[àáâãçéêíóôõú]/gi,
  ],
  [SupportedLanguage.TR]: [
    /\b(ve|veya|ama|ile|için)\b/gi,
    /[çğıöşüÇĞİÖŞÜ]/g,
  ],
  [SupportedLanguage.TH]: [
    /[\u0e00-\u0e7f]+/g, // Thai characters
    /\b(และ|หรือ|แต่|ใน|กับ)\b/gi,
  ],
  [SupportedLanguage.IT]: [
    /\b(il|la|lo|gli|le|e|o|ma|in|con)\b/gi,
    /[àèéìòù]/gi,
  ],
  [SupportedLanguage.HI]: [
    /[\u0900-\u097f]+/g, // Devanagari script
    /\b(और|या|लेकिन|में|के साथ)\b/gi,
  ],
};

/**
 * Common phrases for language detection
 */
const COMMON_PHRASES: Record<SupportedLanguage, string[]> = {
  [SupportedLanguage.EN]: ['hello', 'please', 'thank you', 'yes', 'no'],
  [SupportedLanguage.RU]: ['привет', 'пожалуйста', 'спасибо', 'да', 'нет'],
  [SupportedLanguage.ZH_CN]: ['你好', '请', '谢谢', '是', '不是'],
  [SupportedLanguage.ZH_TW]: ['你好', '請', '謝謝', '是', '不是'],
  [SupportedLanguage.JA]: ['こんにちは', 'お願いします', 'ありがとう', 'はい', 'いいえ'],
  [SupportedLanguage.KO]: ['안녕하세요', '부탁합니다', '감사합니다', '네', '아니요'],
  [SupportedLanguage.DE]: ['hallo', 'bitte', 'danke', 'ja', 'nein'],
  [SupportedLanguage.FR]: ['bonjour', 's\'il vous plaît', 'merci', 'oui', 'non'],
  [SupportedLanguage.ES]: ['hola', 'por favor', 'gracias', 'sí', 'no'],
  [SupportedLanguage.PT]: ['olá', 'por favor', 'obrigado', 'sim', 'não'],
  [SupportedLanguage.TR]: ['merhaba', 'lütfen', 'teşekkürler', 'evet', 'hayır'],
  [SupportedLanguage.TH]: ['สวัสดี', 'กรุณา', 'ขอบคุณ', 'ใช่', 'ไม่'],
  [SupportedLanguage.IT]: ['ciao', 'per favore', 'grazie', 'sì', 'no'],
  [SupportedLanguage.HI]: ['नमस्ते', 'कृपया', 'धन्यवाद', 'हाँ', 'नहीं'],
};

/**
 * Language Manager for Claude Flow Multilang
 */
export class LanguageManager {
  private translationCache: Map<string, Map<SupportedLanguage, string>>;
  private detectionCache: Map<string, LanguageDetectionResult>;
  private intentPatterns: Map<SupportedLanguage, Map<string, RegExp>>;

  constructor(private logger: ILogger) {
    this.translationCache = new Map();
    this.detectionCache = new Map();
    this.intentPatterns = new Map();
    this.initializeIntentPatterns();
  }

  /**
   * Detect language from text input
   */
  async detectLanguage(text: string): Promise<LanguageDetectionResult> {
    // Check cache first
    if (this.detectionCache.has(text)) {
      return this.detectionCache.get(text)!;
    }

    const scores: Map<SupportedLanguage, number> = new Map();
    
    // Score each language based on patterns
    for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS) as Array<[SupportedLanguage, RegExp[]]>) {
      let score = 0;
      
      for (const pattern of patterns) {
        const matches = text.match(pattern);
        if (matches) {
          score += matches.length;
        }
      }
      
      // Check for common phrases
      const phrases = COMMON_PHRASES[lang];
      for (const phrase of phrases) {
        if (text.toLowerCase().includes(phrase.toLowerCase())) {
          score += 10; // Boost score for common phrases
        }
      }
      
      scores.set(lang, score);
    }
    
    // Sort languages by score
    const sortedScores = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1]);
    
    // Calculate confidence
    const totalScore = Array.from(scores.values()).reduce((sum, score) => sum + score, 0);
    const topScore = sortedScores[0][1];
    const confidence = totalScore > 0 ? topScore / totalScore : 0;
    
    // Prepare alternatives
    const alternatives = sortedScores.slice(1, 4).map(([lang, score]) => ({
      language: lang,
      confidence: totalScore > 0 ? score / totalScore : 0,
    }));
    
    const result: LanguageDetectionResult = {
      language: sortedScores[0][0],
      confidence,
      alternatives,
      script: this.detectScript(text),
    };
    
    // Cache the result
    this.detectionCache.set(text, result);
    
    return result;
  }

  /**
   * Detect script type from text
   */
  private detectScript(text: string): 'latin' | 'cyrillic' | 'cjk' | 'arabic' | 'devanagari' {
    if (/[а-яА-ЯёЁ]/.test(text)) return 'cyrillic';
    if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(text)) return 'cjk';
    if (/[\u0600-\u06ff]/.test(text)) return 'arabic';
    if (/[\u0900-\u097f]/.test(text)) return 'devanagari';
    return 'latin';
  }

  /**
   * Translate text with context
   */
  async translate(text: string, context: TranslationContext): Promise<string> {
    // Check cache
    const cacheKey = text;
    if (this.translationCache.has(cacheKey)) {
      const cached = this.translationCache.get(cacheKey)?.get(context.targetLanguage);
      if (cached) return cached;
    }
    
    // For now, return a placeholder translation
    // In production, this would integrate with translation APIs
    const translated = await this.performTranslation(text, context);
    
    // Cache the translation
    if (!this.translationCache.has(cacheKey)) {
      this.translationCache.set(cacheKey, new Map());
    }
    this.translationCache.get(cacheKey)!.set(context.targetLanguage, translated);
    
    return translated;
  }

  /**
   * Perform actual translation (placeholder for API integration)
   */
  private async performTranslation(text: string, context: TranslationContext): Promise<string> {
    // This is a placeholder implementation
    // In production, integrate with translation services like:
    // - Google Translate API
    // - DeepL API
    // - Azure Translator
    // - OpenAI GPT for context-aware translation
    
    this.logger.info('Translation requested', {
      source: context.sourceLanguage,
      target: context.targetLanguage,
      textLength: text.length,
    });
    
    // Simple mock translation for demonstration
    const prefix = this.getLanguagePrefix(context.targetLanguage);
    return `[${prefix}] ${text}`;
  }

  /**
   * Get language prefix for mock translations
   */
  private getLanguagePrefix(language: SupportedLanguage): string {
    const prefixes: Record<SupportedLanguage, string> = {
      [SupportedLanguage.EN]: 'EN',
      [SupportedLanguage.RU]: 'RU',
      [SupportedLanguage.ZH_CN]: 'ZH-CN',
      [SupportedLanguage.ZH_TW]: 'ZH-TW',
      [SupportedLanguage.JA]: 'JA',
      [SupportedLanguage.KO]: 'KO',
      [SupportedLanguage.DE]: 'DE',
      [SupportedLanguage.FR]: 'FR',
      [SupportedLanguage.ES]: 'ES',
      [SupportedLanguage.PT]: 'PT',
      [SupportedLanguage.TR]: 'TR',
      [SupportedLanguage.TH]: 'TH',
      [SupportedLanguage.IT]: 'IT',
      [SupportedLanguage.HI]: 'HI',
    };
    return prefixes[language] || 'UNKNOWN';
  }

  /**
   * Normalize text based on language rules
   */
  async normalize(text: string, language: SupportedLanguage): Promise<string> {
    let normalized = text.trim();
    
    // Language-specific normalization
    switch (language) {
      case SupportedLanguage.JA:
        // Convert full-width characters to half-width for ASCII
        normalized = this.convertFullWidthToHalfWidth(normalized);
        break;
      
      case SupportedLanguage.ZH_CN:
      case SupportedLanguage.ZH_TW:
        // Simplify traditional/simplified Chinese if needed
        normalized = this.normalizeChineseText(normalized);
        break;
      
      
      default:
        // Standard normalization for Latin scripts
        normalized = normalized.toLowerCase();
        break;
    }
    
    return normalized;
  }

  /**
   * Extract intent and entities from text
   */
  async extractIntent(
    text: string,
    language: SupportedLanguage,
  ): Promise<{
    intent: string;
    entities: Record<string, any>;
    confidence: number;
  }> {
    const patterns = this.intentPatterns.get(language) || this.intentPatterns.get(SupportedLanguage.EN)!;
    
    let detectedIntent = 'unknown';
    let confidence = 0;
    const entities: Record<string, any> = {};
    
    // Check each intent pattern
    for (const [intent, pattern] of patterns.entries()) {
      if (pattern.test(text)) {
        detectedIntent = intent;
        confidence = 0.8; // Base confidence for pattern match
        
        // Extract entities based on pattern groups
        const matches = text.match(pattern);
        if (matches && matches.groups) {
          Object.assign(entities, matches.groups);
        }
        break;
      }
    }
    
    // If no pattern matched, try to infer intent
    if (detectedIntent === 'unknown') {
      detectedIntent = this.inferIntent(text, language);
      confidence = 0.5; // Lower confidence for inferred intent
    }
    
    return { intent: detectedIntent, entities, confidence };
  }

  /**
   * Initialize intent patterns for different languages
   */
  private initializeIntentPatterns(): void {
    // English patterns
    const enPatterns = new Map<string, RegExp>([
      ['create', /\b(create|make|build|generate|construct)\b.*?(?<target>\w+)/i],
      ['delete', /\b(delete|remove|destroy|eliminate)\b.*?(?<target>\w+)/i],
      ['update', /\b(update|modify|change|edit)\b.*?(?<target>\w+)/i],
      ['search', /\b(search|find|look for|query)\b.*?(?<query>.*)/i],
      ['help', /\b(help|assist|support|guide)\b/i],
    ]);
    this.intentPatterns.set(SupportedLanguage.EN, enPatterns);
    
    // Russian patterns
    const ruPatterns = new Map<string, RegExp>([
      ['create', /\b(создать|создай|сделать|сделай|построить)\b.*?(?<target>\w+)/i],
      ['delete', /\b(удалить|удали|убрать|убери)\b.*?(?<target>\w+)/i],
      ['update', /\b(обновить|обнови|изменить|измени)\b.*?(?<target>\w+)/i],
      ['search', /\b(найти|найди|искать|ищи|поиск)\b.*?(?<query>.*)/i],
      ['help', /\b(помощь|помоги|поддержка|справка)\b/i],
    ]);
    this.intentPatterns.set(SupportedLanguage.RU, ruPatterns);
    
    // Add more language patterns as needed...
  }

  /**
   * Infer intent when no pattern matches
   */
  private inferIntent(text: string, _language: SupportedLanguage): string {
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based inference
    const intentKeywords: Record<string, string[]> = {
      'create': ['new', 'add', 'create', 'make', 'build'],
      'delete': ['delete', 'remove', 'destroy', 'clear'],
      'update': ['update', 'change', 'modify', 'edit'],
      'search': ['find', 'search', 'look', 'where', 'what'],
      'help': ['help', 'how', 'why', 'explain', 'guide'],
    };
    
    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general';
  }

  /**
   * Convert full-width characters to half-width (for Japanese)
   */
  private convertFullWidthToHalfWidth(text: string): string {
    return text.replace(/[\uff01-\uff5e]/g, (ch) => {
      return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
    });
  }

  /**
   * Normalize Chinese text
   */
  private normalizeChineseText(text: string): string {
    // Placeholder for Chinese text normalization
    // Would include traditional/simplified conversion
    return text;
  }


  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.translationCache.clear();
    this.detectionCache.clear();
    this.logger.info('Language manager cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    translationEntries: number;
    detectionEntries: number;
    totalSize: number;
  } {
    const translationEntries = this.translationCache.size;
    const detectionEntries = this.detectionCache.size;
    
    // Estimate cache size (simplified)
    let totalSize = 0;
    this.translationCache.forEach((langMap) => {
      langMap.forEach((translation) => {
        totalSize += translation.length * 2; // UTF-16 encoding
      });
    });
    
    return {
      translationEntries,
      detectionEntries,
      totalSize,
    };
  }
}