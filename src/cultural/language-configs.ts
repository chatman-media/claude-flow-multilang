/**
 * Claude Flow Multilang Framework - Extended Language Configurations
 * Cultural configurations for additional supported languages
 */

import { SupportedLanguage, CulturalContext } from '../polyglot/types.js';

/**
 * Extended cultural configurations for new languages
 */
export const EXTENDED_CULTURAL_CONFIGS: Record<SupportedLanguage.TH | SupportedLanguage.IT | SupportedLanguage.HI, CulturalContext> = {
  [SupportedLanguage.TH]: {
    language: SupportedLanguage.TH,
    region: 'TH',
    timezone: 'Asia/Bangkok',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1,234.56',
    currencyFormat: '฿1,234.56',
    formalityLevel: 'formal',
    businessEtiquette: {
      greetingStyle: 'สวัสดีครับ/ค่ะ',
      communicationStyle: 'indirect',
      decisionMaking: 'hierarchical',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      other: 'true', // Thai doesn't use plural forms
    },
  },
  
  [SupportedLanguage.IT]: {
    language: SupportedLanguage.IT,
    region: 'IT',
    timezone: 'Europe/Rome',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1.234,56',
    currencyFormat: '€ 1.234,56',
    formalityLevel: 'formal',
    businessEtiquette: {
      greetingStyle: 'Buongiorno',
      communicationStyle: 'contextual',
      decisionMaking: 'hierarchical',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      one: 'n == 1',
      other: 'n != 1',
    },
  },
  
  [SupportedLanguage.HI]: {
    language: SupportedLanguage.HI,
    region: 'IN',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1,23,456.78', // Indian numbering system
    currencyFormat: '₹1,23,456.78',
    formalityLevel: 'formal',
    businessEtiquette: {
      greetingStyle: 'नमस्ते',
      communicationStyle: 'indirect',
      decisionMaking: 'hierarchical',
    },
    writingDirection: 'ltr',
    pluralizationRules: {
      one: 'n == 0 || n == 1',
      other: 'n > 1',
    },
  },
};

/**
 * Language locale mappings
 */
export const LANGUAGE_LOCALES: Record<SupportedLanguage, string> = {
  [SupportedLanguage.RU]: 'ru-RU',
  [SupportedLanguage.EN]: 'en-US',
  [SupportedLanguage.ES]: 'es-ES',
  [SupportedLanguage.FR]: 'fr-FR',
  [SupportedLanguage.DE]: 'de-DE',
  [SupportedLanguage.PT]: 'pt-PT',
  [SupportedLanguage.ZH_CN]: 'zh-CN',
  [SupportedLanguage.ZH_TW]: 'zh-TW',
  [SupportedLanguage.JA]: 'ja-JP',
  [SupportedLanguage.KO]: 'ko-KR',
  [SupportedLanguage.TR]: 'tr-TR',
  [SupportedLanguage.TH]: 'th-TH',
  [SupportedLanguage.IT]: 'it-IT',
  [SupportedLanguage.HI]: 'hi-IN',
};

/**
 * Extended time-based greetings
 */
export const EXTENDED_TIME_GREETINGS: Record<SupportedLanguage.TH | SupportedLanguage.IT | SupportedLanguage.HI, Record<string, string>> = {
  [SupportedLanguage.TH]: {
    morning: 'สวัสดีตอนเช้า',
    afternoon: 'สวัสดีตอนบ่าย',
    evening: 'สวัสดีตอนเย็น',
    night: 'ราตรีสวัสดิ์',
  },
  [SupportedLanguage.IT]: {
    morning: 'Buongiorno',
    afternoon: 'Buon pomeriggio',
    evening: 'Buonasera',
    night: 'Buonanotte',
  },
  [SupportedLanguage.HI]: {
    morning: 'शुभ प्रभात',
    afternoon: 'शुभ दोपहर',
    evening: 'शुभ संध्या',
    night: 'शुभ रात्रि',
  },
};

/**
 * Business communication templates by language
 */
export const BUSINESS_TEMPLATES: Record<SupportedLanguage, {
  emailOpening: string;
  emailClosing: string;
  meetingRequest: string;
  thankYou: string;
}> = {
  [SupportedLanguage.EN]: {
    emailOpening: 'Dear {name},',
    emailClosing: 'Best regards,',
    meetingRequest: 'I would like to schedule a meeting to discuss {topic}.',
    thankYou: 'Thank you for your time and consideration.',
  },
  [SupportedLanguage.RU]: {
    emailOpening: 'Уважаемый(ая) {name},',
    emailClosing: 'С уважением,',
    meetingRequest: 'Хотел(а) бы назначить встречу для обсуждения {topic}.',
    thankYou: 'Спасибо за ваше время и внимание.',
  },
  [SupportedLanguage.JA]: {
    emailOpening: '{name}様',
    emailClosing: 'よろしくお願いいたします。',
    meetingRequest: '{topic}について打ち合わせをさせていただければと思います。',
    thankYou: 'お忙しい中、ありがとうございます。',
  },
  [SupportedLanguage.ZH_CN]: {
    emailOpening: '尊敬的{name}：',
    emailClosing: '此致敬礼',
    meetingRequest: '我想安排一次会议讨论{topic}。',
    thankYou: '感谢您的时间和关注。',
  },
  [SupportedLanguage.ZH_TW]: {
    emailOpening: '尊敬的{name}：',
    emailClosing: '此致敬禮',
    meetingRequest: '我想安排一次會議討論{topic}。',
    thankYou: '感謝您的時間和關注。',
  },
  [SupportedLanguage.KO]: {
    emailOpening: '{name}님께',
    emailClosing: '감사합니다.',
    meetingRequest: '{topic}에 대해 논의하기 위한 회의를 잡고 싶습니다.',
    thankYou: '시간 내주셔서 감사합니다.',
  },
  [SupportedLanguage.DE]: {
    emailOpening: 'Sehr geehrte(r) {name},',
    emailClosing: 'Mit freundlichen Grüßen',
    meetingRequest: 'Ich möchte gerne ein Meeting vereinbaren, um {topic} zu besprechen.',
    thankYou: 'Vielen Dank für Ihre Zeit und Aufmerksamkeit.',
  },
  [SupportedLanguage.FR]: {
    emailOpening: 'Cher(ère) {name},',
    emailClosing: 'Cordialement',
    meetingRequest: 'Je souhaiterais organiser une réunion pour discuter de {topic}.',
    thankYou: 'Merci pour votre temps et votre attention.',
  },
  [SupportedLanguage.ES]: {
    emailOpening: 'Estimado/a {name},',
    emailClosing: 'Atentamente',
    meetingRequest: 'Me gustaría programar una reunión para discutir {topic}.',
    thankYou: 'Gracias por su tiempo y atención.',
  },
  [SupportedLanguage.PT]: {
    emailOpening: 'Prezado/a {name},',
    emailClosing: 'Atenciosamente',
    meetingRequest: 'Gostaria de agendar uma reunião para discutir {topic}.',
    thankYou: 'Obrigado pelo seu tempo e atenção.',
  },
  [SupportedLanguage.TR]: {
    emailOpening: 'Sayın {name},',
    emailClosing: 'Saygılarımla',
    meetingRequest: '{topic} konusunu görüşmek için bir toplantı ayarlamak istiyorum.',
    thankYou: 'Zaman ayırdığınız için teşekkür ederim.',
  },
  [SupportedLanguage.TH]: {
    emailOpening: 'เรียน {name}',
    emailClosing: 'ขอแสดงความนับถือ',
    meetingRequest: 'ขอนัดประชุมเพื่อหารือเรื่อง {topic}',
    thankYou: 'ขอบคุณสำหรับเวลาและความสนใจของคุณ',
  },
  [SupportedLanguage.IT]: {
    emailOpening: 'Gentile {name},',
    emailClosing: 'Cordiali saluti',
    meetingRequest: 'Vorrei programmare un incontro per discutere {topic}.',
    thankYou: 'Grazie per il tempo e l\'attenzione.',
  },
  [SupportedLanguage.HI]: {
    emailOpening: 'प्रिय {name},',
    emailClosing: 'सादर',
    meetingRequest: 'मैं {topic} पर चर्चा करने के लिए एक बैठक निर्धारित करना चाहूंगा।',
    thankYou: 'आपके समय और ध्यान के लिए धन्यवाद।',
  },
};

/**
 * Number formatting functions for different locales
 */
export function formatNumberByLocale(
  number: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions,
): string {
  const locale = LANGUAGE_LOCALES[language];
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Date formatting functions for different locales
 */
export function formatDateByLocale(
  date: Date,
  language: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale = LANGUAGE_LOCALES[language];
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Currency formatting functions
 */
export function formatCurrencyByLocale(
  amount: number,
  language: SupportedLanguage,
  currency?: string,
): string {
  const locale = LANGUAGE_LOCALES[language];
  const currencyMap: Record<SupportedLanguage, string> = {
    [SupportedLanguage.EN]: 'USD',
    [SupportedLanguage.RU]: 'RUB',
    [SupportedLanguage.JA]: 'JPY',
    [SupportedLanguage.ZH_CN]: 'CNY',
    [SupportedLanguage.ZH_TW]: 'TWD',
    [SupportedLanguage.KO]: 'KRW',
    [SupportedLanguage.DE]: 'EUR',
    [SupportedLanguage.FR]: 'EUR',
    [SupportedLanguage.ES]: 'EUR',
    [SupportedLanguage.PT]: 'EUR',
    [SupportedLanguage.TR]: 'TRY',
    [SupportedLanguage.TH]: 'THB',
    [SupportedLanguage.IT]: 'EUR',
    [SupportedLanguage.HI]: 'INR',
  };
  
  const selectedCurrency = currency || currencyMap[language] || 'USD';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: selectedCurrency,
  }).format(amount);
}