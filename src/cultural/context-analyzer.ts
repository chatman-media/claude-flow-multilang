/**
 * Claude Flow Multilang Framework - Cultural Context Analyzer
 * Analyzes and adapts content based on cultural norms and business etiquette
 */

import { SupportedLanguage, CulturalContext } from '../polyglot/types.js';
import { ILogger } from '../core/logger.js';

/**
 * Cultural configurations for each supported language/region
 */
const CULTURAL_CONFIGS: Record<SupportedLanguage, CulturalContext> = {
  [SupportedLanguage.EN]: {
    language: SupportedLanguage.EN,
    region: 'US',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '1,234.56',
    currencyFormat: '$1,234.56',
    formalityLevel: 'neutral',
    businessEtiquette: {
      greetingStyle: 'Hi/Hello',
      communicationStyle: 'direct',
      decisionMaking: 'individual',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      one: 1,
      other: 'n != 1',
    },
  },
  
  [SupportedLanguage.RU]: {
    language: SupportedLanguage.RU,
    region: 'RU',
    timezone: 'Europe/Moscow',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1 234,56',
    currencyFormat: '1 234,56 ₽',
    formalityLevel: 'formal',
    businessEtiquette: {
      greetingStyle: 'Здравствуйте',
      communicationStyle: 'contextual',
      decisionMaking: 'hierarchical',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      one: 'n % 10 == 1 && n % 100 != 11',
      few: 'n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)',
      many: 'other',
    },
  },
  
  [SupportedLanguage.JA]: {
    language: SupportedLanguage.JA,
    region: 'JP',
    timezone: 'Asia/Tokyo',
    dateFormat: 'YYYY年MM月DD日',
    numberFormat: '1,234.56',
    currencyFormat: '¥1,234',
    formalityLevel: 'very-formal',
    businessEtiquette: {
      greetingStyle: 'お世話になっております',
      communicationStyle: 'indirect',
      decisionMaking: 'consensus',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      other: 'true', // Japanese doesn't have plural forms
    },
  },
  
  [SupportedLanguage.ZH_CN]: {
    language: SupportedLanguage.ZH_CN,
    region: 'CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY年MM月DD日',
    numberFormat: '1,234.56',
    currencyFormat: '¥1,234.56',
    formalityLevel: 'formal',
    businessEtiquette: {
      greetingStyle: '您好',
      communicationStyle: 'indirect',
      decisionMaking: 'hierarchical',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      other: 'true', // Chinese doesn't have plural forms
    },
  },
  
  [SupportedLanguage.ZH_TW]: {
    language: SupportedLanguage.ZH_TW,
    region: 'TW',
    timezone: 'Asia/Taipei',
    dateFormat: 'YYYY年MM月DD日',
    numberFormat: '1,234.56',
    currencyFormat: 'NT$1,234.56',
    formalityLevel: 'formal',
    businessEtiquette: {
      greetingStyle: '您好',
      communicationStyle: 'indirect',
      decisionMaking: 'consensus',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      other: 'true',
    },
  },
  
  [SupportedLanguage.KO]: {
    language: SupportedLanguage.KO,
    region: 'KR',
    timezone: 'Asia/Seoul',
    dateFormat: 'YYYY년 MM월 DD일',
    numberFormat: '1,234.56',
    currencyFormat: '₩1,234',
    formalityLevel: 'very-formal',
    businessEtiquette: {
      greetingStyle: '안녕하십니까',
      communicationStyle: 'indirect',
      decisionMaking: 'hierarchical',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      other: 'true', // Korean doesn't have plural forms
    },
  },
  
  [SupportedLanguage.DE]: {
    language: SupportedLanguage.DE,
    region: 'DE',
    timezone: 'Europe/Berlin',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1.234,56',
    currencyFormat: '1.234,56 €',
    formalityLevel: 'formal',
    businessEtiquette: {
      greetingStyle: 'Guten Tag',
      communicationStyle: 'direct',
      decisionMaking: 'consensus',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      one: 'n == 1',
      other: 'n != 1',
    },
  },
  
  [SupportedLanguage.FR]: {
    language: SupportedLanguage.FR,
    region: 'FR',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1 234,56',
    currencyFormat: '1 234,56 €',
    formalityLevel: 'formal',
    businessEtiquette: {
      greetingStyle: 'Bonjour',
      communicationStyle: 'contextual',
      decisionMaking: 'hierarchical',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      one: 'n == 0 || n == 1',
      other: 'n > 1',
    },
  },
  
  [SupportedLanguage.ES]: {
    language: SupportedLanguage.ES,
    region: 'ES',
    timezone: 'Europe/Madrid',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1.234,56',
    currencyFormat: '1.234,56 €',
    formalityLevel: 'neutral',
    businessEtiquette: {
      greetingStyle: 'Hola/Buenos días',
      communicationStyle: 'contextual',
      decisionMaking: 'hierarchical',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      one: 'n == 1',
      other: 'n != 1',
    },
  },
  
  [SupportedLanguage.PT]: {
    language: SupportedLanguage.PT,
    region: 'BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1.234,56',
    currencyFormat: 'R$ 1.234,56',
    formalityLevel: 'neutral',
    businessEtiquette: {
      greetingStyle: 'Olá/Bom dia',
      communicationStyle: 'contextual',
      decisionMaking: 'consensus',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      one: 'n == 0 || n == 1',
      other: 'n > 1',
    },
  },
  
  [SupportedLanguage.TR]: {
    language: SupportedLanguage.TR,
    region: 'TR',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1.234,56',
    currencyFormat: '1.234,56 ₺',
    formalityLevel: 'formal',
    businessEtiquette: {
      greetingStyle: 'Merhaba/Günaydın',
      communicationStyle: 'indirect',
      decisionMaking: 'hierarchical',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      one: 'n == 1',
      other: 'n != 1',
    },
  },
};

/**
 * Time-based greetings for different cultures
 */
const TIME_BASED_GREETINGS: Record<SupportedLanguage, Record<string, string>> = {
  [SupportedLanguage.EN]: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    night: 'Good night',
  },
  [SupportedLanguage.RU]: {
    morning: 'Доброе утро',
    afternoon: 'Добрый день',
    evening: 'Добрый вечер',
    night: 'Спокойной ночи',
  },
  [SupportedLanguage.JA]: {
    morning: 'おはようございます',
    afternoon: 'こんにちは',
    evening: 'こんばんは',
    night: 'おやすみなさい',
  },
  [SupportedLanguage.ZH_CN]: {
    morning: '早上好',
    afternoon: '下午好',
    evening: '晚上好',
    night: '晚安',
  },
  [SupportedLanguage.ZH_TW]: {
    morning: '早安',
    afternoon: '午安',
    evening: '晚安',
    night: '晚安',
  },
  [SupportedLanguage.KO]: {
    morning: '좋은 아침입니다',
    afternoon: '안녕하세요',
    evening: '좋은 저녁입니다',
    night: '안녕히 주무세요',
  },
  [SupportedLanguage.DE]: {
    morning: 'Guten Morgen',
    afternoon: 'Guten Tag',
    evening: 'Guten Abend',
    night: 'Gute Nacht',
  },
  [SupportedLanguage.FR]: {
    morning: 'Bonjour',
    afternoon: 'Bon après-midi',
    evening: 'Bonsoir',
    night: 'Bonne nuit',
  },
  [SupportedLanguage.ES]: {
    morning: 'Buenos días',
    afternoon: 'Buenas tardes',
    evening: 'Buenas tardes',
    night: 'Buenas noches',
  },
  [SupportedLanguage.PT]: {
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    evening: 'Boa noite',
    night: 'Boa noite',
  },
  [SupportedLanguage.TR]: {
    morning: 'Günaydın',
    afternoon: 'İyi günler',
    evening: 'İyi akşamlar',
    night: 'İyi geceler',
  },
};

/**
 * Cultural Context Analyzer
 */
export class CulturalContextAnalyzer {
  private contextCache: Map<string, CulturalContext>;
  
  constructor(private logger: ILogger) {
    this.contextCache = new Map();
  }
  
  /**
   * Analyze cultural context for a given language and text
   */
  async analyze(
    language: SupportedLanguage,
    text: string,
    options?: {
      region?: string;
      timezone?: string;
      timeOfDay?: Date;
    },
  ): Promise<CulturalContext> {
    // Get base cultural configuration
    const baseContext = { ...CULTURAL_CONFIGS[language] };
    
    // Override with provided options
    if (options?.region) {
      baseContext.region = options.region;
    }
    if (options?.timezone) {
      baseContext.timezone = options.timezone;
    }
    
    // Analyze formality level from text
    const detectedFormality = this.detectFormalityLevel(text, language);
    if (detectedFormality) {
      baseContext.formalityLevel = detectedFormality;
    }
    
    // Adjust greeting based on time of day
    if (options?.timeOfDay) {
      const greeting = this.getTimeBasedGreeting(language, options.timeOfDay);
      if (greeting && baseContext.businessEtiquette) {
        baseContext.businessEtiquette.greetingStyle = greeting;
      }
    }
    
    // Detect business context
    const businessContext = this.detectBusinessContext(text, language);
    if (businessContext && baseContext.businessEtiquette) {
      Object.assign(baseContext.businessEtiquette, businessContext);
    }
    
    return baseContext;
  }
  
  /**
   * Detect formality level from text
   */
  private detectFormalityLevel(
    text: string,
    language: SupportedLanguage,
  ): 'informal' | 'neutral' | 'formal' | 'very-formal' | null {
    const lowerText = text.toLowerCase();
    
    // Language-specific formality markers
    const formalityMarkers: Record<SupportedLanguage, {
      informal: string[];
      formal: string[];
      veryFormal: string[];
    }> = {
      [SupportedLanguage.EN]: {
        informal: ['hey', 'hi', 'yeah', 'yep', 'nope', 'gonna', 'wanna'],
        formal: ['please', 'kindly', 'would you', 'could you', 'sir', 'madam'],
        veryFormal: ['respectfully', 'esteemed', 'distinguished', 'honorable'],
      },
      [SupportedLanguage.RU]: {
        informal: ['привет', 'ты', 'твой', 'давай', 'окей'],
        formal: ['вы', 'ваш', 'пожалуйста', 'будьте добры'],
        veryFormal: ['уважаемый', 'господин', 'госпожа', 'высокоуважаемый'],
      },
      [SupportedLanguage.JA]: {
        informal: ['だ', 'だよ', 'だね', 'じゃん', 'ちゃん'],
        formal: ['です', 'ます', 'ください', 'さん'],
        veryFormal: ['ございます', 'いらっしゃいます', '申し上げます', '様'],
      },
      [SupportedLanguage.KO]: {
        informal: ['야', '아/어', '니', '너', '네'],
        formal: ['요', '습니다', '세요', '씨'],
        veryFormal: ['십니다', '하십시오', '님', '귀하'],
      },
      // Add more languages as needed
    };
    
    const markers = formalityMarkers[language];
    if (!markers) return null;
    
    // Check for formality markers
    let informalCount = 0;
    let formalCount = 0;
    let veryFormalCount = 0;
    
    markers.informal.forEach(marker => {
      if (lowerText.includes(marker)) informalCount++;
    });
    
    markers.formal.forEach(marker => {
      if (lowerText.includes(marker)) formalCount++;
    });
    
    markers.veryFormal.forEach(marker => {
      if (lowerText.includes(marker)) veryFormalCount++;
    });
    
    // Determine formality level based on counts
    if (veryFormalCount > 0) return 'very-formal';
    if (formalCount > informalCount) return 'formal';
    if (informalCount > formalCount) return 'informal';
    
    return 'neutral';
  }
  
  /**
   * Get time-based greeting
   */
  private getTimeBasedGreeting(language: SupportedLanguage, time: Date): string | null {
    const greetings = TIME_BASED_GREETINGS[language];
    if (!greetings) return null;
    
    const hour = time.getHours();
    
    if (hour >= 5 && hour < 12) return greetings.morning;
    if (hour >= 12 && hour < 17) return greetings.afternoon;
    if (hour >= 17 && hour < 21) return greetings.evening;
    return greetings.night;
  }
  
  /**
   * Detect business context from text
   */
  private detectBusinessContext(
    text: string,
    language: SupportedLanguage,
  ): Partial<CulturalContext['businessEtiquette']> | null {
    const lowerText = text.toLowerCase();
    
    // Business context indicators
    const businessIndicators = {
      meeting: ['meeting', 'встреча', '会議', '会议', '회의'],
      presentation: ['presentation', 'презентация', 'プレゼン', '演示', '발표'],
      negotiation: ['negotiation', 'переговоры', '交渉', '谈判', '협상'],
      contract: ['contract', 'договор', '契約', '合同', '계약'],
    };
    
    // Check for business context
    for (const [context, keywords] of Object.entries(businessIndicators)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        // Return appropriate business etiquette for the context
        if (context === 'negotiation') {
          return {
            communicationStyle: 'indirect',
            decisionMaking: 'consensus',
          };
        }
        if (context === 'presentation') {
          return {
            communicationStyle: 'direct',
            decisionMaking: 'hierarchical',
          };
        }
      }
    }
    
    return null;
  }
  
  /**
   * Format date according to cultural context
   */
  formatDate(date: Date, context: CulturalContext): string {
    const { dateFormat } = context;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return dateFormat
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('年', '年')
      .replace('月', '月')
      .replace('日', '日')
      .replace('년', '년')
      .replace('월', '월')
      .replace('일', '일');
  }
  
  /**
   * Format number according to cultural context
   */
  formatNumber(number: number, context: CulturalContext): string {
    const { numberFormat } = context;
    
    // Determine separators from format
    const thousandSep = numberFormat.includes(' ') ? ' ' : 
                       numberFormat.includes('.') && numberFormat.indexOf('.') < numberFormat.indexOf(',') ? '.' : 
                       ',';
    const decimalSep = numberFormat.includes(',') && numberFormat.lastIndexOf(',') > numberFormat.indexOf(thousandSep) ? ',' : '.';
    
    const parts = number.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
    
    return parts.join(decimalSep);
  }
  
  /**
   * Format currency according to cultural context
   */
  formatCurrency(amount: number, context: CulturalContext): string {
    if (!context.currencyFormat) {
      return this.formatNumber(amount, context);
    }
    
    const formatted = this.formatNumber(amount, context);
    const symbol = context.currencyFormat.match(/[¥$€₽₩₺£R\$NT\$]/)?.[0] || '$';
    
    // Determine symbol position
    if (context.currencyFormat.startsWith(symbol)) {
      return `${symbol}${formatted}`;
    } else {
      return `${formatted} ${symbol}`;
    }
  }
  
  /**
   * Apply pluralization rules
   */
  applyPluralization(
    count: number,
    singular: string,
    plural: string,
    context: CulturalContext,
  ): string {
    const rules = context.pluralizationRules;
    if (!rules) return count === 1 ? singular : plural;
    
    // Simplified pluralization logic
    // In production, would use a proper i18n library like ICU MessageFormat
    if (rules.one && eval(rules.one.replace('n', String(count)))) {
      return singular;
    }
    
    return plural;
  }
  
  /**
   * Get cultural recommendations for communication
   */
  getCommunicationRecommendations(context: CulturalContext): string[] {
    const recommendations: string[] = [];
    
    if (context.businessEtiquette) {
      const { communicationStyle, decisionMaking } = context.businessEtiquette;
      
      if (communicationStyle === 'indirect') {
        recommendations.push('Use indirect communication, avoid direct confrontation');
        recommendations.push('Pay attention to non-verbal cues and context');
      }
      
      if (communicationStyle === 'contextual') {
        recommendations.push('Consider the broader context when communicating');
        recommendations.push('Build relationship before discussing business');
      }
      
      if (decisionMaking === 'consensus') {
        recommendations.push('Involve all stakeholders in decision-making');
        recommendations.push('Allow time for group discussion and agreement');
      }
      
      if (decisionMaking === 'hierarchical') {
        recommendations.push('Respect organizational hierarchy');
        recommendations.push('Defer to senior members for final decisions');
      }
    }
    
    if (context.formalityLevel === 'very-formal') {
      recommendations.push('Use honorifics and formal titles');
      recommendations.push('Maintain professional distance');
    }
    
    return recommendations;
  }
  
  /**
   * Check if text contains culturally sensitive content
   */
  checkCulturalSensitivity(
    text: string,
    context: CulturalContext,
  ): {
    isSensitive: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];
    
    // Check for potentially sensitive topics
    const sensitiveTopics = {
      politics: ['politics', 'government', 'election', 'политика', '政治'],
      religion: ['religion', 'god', 'faith', 'религия', '宗教'],
      personal: ['age', 'salary', 'marriage', 'возраст', 'зарплата', '年齢', '給料'],
    };
    
    const lowerText = text.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(sensitiveTopics)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        warnings.push(`Contains potentially sensitive topic: ${topic}`);
      }
    }
    
    // Check for informal language in formal context
    if (context.formalityLevel === 'formal' || context.formalityLevel === 'very-formal') {
      const informalMarkers = ['hey', 'yeah', 'nope', 'gonna', 'wanna'];
      if (informalMarkers.some(marker => lowerText.includes(marker))) {
        warnings.push('Informal language detected in formal context');
      }
    }
    
    return {
      isSensitive: warnings.length > 0,
      warnings,
    };
  }
}