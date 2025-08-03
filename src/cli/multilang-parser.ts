/**
 * Claude Flow Multilang Framework - Multilingual Command Parser
 * Parse and execute commands in native languages
 */

import { SupportedLanguage } from '../polyglot/types.js';
import { LanguageManager } from '../i18n/language-manager.js';
import { ILogger } from '../core/logger.js';

/**
 * Command translations for all supported languages
 */
const COMMAND_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  [SupportedLanguage.EN]: {
    'create': 'create',
    'build': 'build',
    'test': 'test',
    'deploy': 'deploy',
    'help': 'help',
    'start': 'start',
    'stop': 'stop',
    'status': 'status',
    'config': 'config',
    'init': 'init',
    'swarm': 'swarm',
    'agent': 'agent',
    'memory': 'memory',
    'workflow': 'workflow',
  },
  
  [SupportedLanguage.RU]: {
    'создать': 'create',
    'создай': 'create',
    'построить': 'build',
    'собрать': 'build',
    'тест': 'test',
    'тестировать': 'test',
    'проверить': 'test',
    'развернуть': 'deploy',
    'деплой': 'deploy',
    'помощь': 'help',
    'справка': 'help',
    'старт': 'start',
    'запустить': 'start',
    'стоп': 'stop',
    'остановить': 'stop',
    'статус': 'status',
    'состояние': 'status',
    'конфиг': 'config',
    'настройки': 'config',
    'инит': 'init',
    'инициализация': 'init',
    'рой': 'swarm',
    'агент': 'agent',
    'память': 'memory',
    'процесс': 'workflow',
  },
  
  [SupportedLanguage.JA]: {
    '作成': 'create',
    '作る': 'create',
    'ビルド': 'build',
    '構築': 'build',
    'テスト': 'test',
    '試験': 'test',
    'デプロイ': 'deploy',
    '展開': 'deploy',
    'ヘルプ': 'help',
    '助け': 'help',
    'スタート': 'start',
    '開始': 'start',
    'ストップ': 'stop',
    '停止': 'stop',
    'ステータス': 'status',
    '状態': 'status',
    '設定': 'config',
    '初期化': 'init',
    'スワーム': 'swarm',
    '群れ': 'swarm',
    'エージェント': 'agent',
    'メモリ': 'memory',
    '記憶': 'memory',
    'ワークフロー': 'workflow',
  },
  
  [SupportedLanguage.ZH_CN]: {
    '创建': 'create',
    '建立': 'create',
    '构建': 'build',
    '建造': 'build',
    '测试': 'test',
    '检测': 'test',
    '部署': 'deploy',
    '发布': 'deploy',
    '帮助': 'help',
    '启动': 'start',
    '开始': 'start',
    '停止': 'stop',
    '状态': 'status',
    '配置': 'config',
    '设置': 'config',
    '初始化': 'init',
    '群': 'swarm',
    '代理': 'agent',
    '内存': 'memory',
    '工作流': 'workflow',
  },
  
  [SupportedLanguage.ZH_TW]: {
    '創建': 'create',
    '建立': 'create',
    '構建': 'build',
    '建造': 'build',
    '測試': 'test',
    '檢測': 'test',
    '部署': 'deploy',
    '發布': 'deploy',
    '幫助': 'help',
    '啟動': 'start',
    '開始': 'start',
    '停止': 'stop',
    '狀態': 'status',
    '配置': 'config',
    '設置': 'config',
    '初始化': 'init',
    '群': 'swarm',
    '代理': 'agent',
    '內存': 'memory',
    '工作流': 'workflow',
  },
  
  [SupportedLanguage.KO]: {
    '생성': 'create',
    '만들기': 'create',
    '빌드': 'build',
    '구축': 'build',
    '테스트': 'test',
    '시험': 'test',
    '배포': 'deploy',
    '도움말': 'help',
    '시작': 'start',
    '중지': 'stop',
    '정지': 'stop',
    '상태': 'status',
    '설정': 'config',
    '구성': 'config',
    '초기화': 'init',
    '스웜': 'swarm',
    '에이전트': 'agent',
    '메모리': 'memory',
    '워크플로': 'workflow',
  },
  
  [SupportedLanguage.DE]: {
    'erstellen': 'create',
    'bauen': 'build',
    'testen': 'test',
    'prüfen': 'test',
    'bereitstellen': 'deploy',
    'hilfe': 'help',
    'starten': 'start',
    'stoppen': 'stop',
    'status': 'status',
    'zustand': 'status',
    'konfiguration': 'config',
    'einstellungen': 'config',
    'initialisieren': 'init',
    'schwarm': 'swarm',
    'agent': 'agent',
    'speicher': 'memory',
    'arbeitsablauf': 'workflow',
  },
  
  [SupportedLanguage.FR]: {
    'créer': 'create',
    'construire': 'build',
    'tester': 'test',
    'déployer': 'deploy',
    'aide': 'help',
    'démarrer': 'start',
    'commencer': 'start',
    'arrêter': 'stop',
    'statut': 'status',
    'état': 'status',
    'configuration': 'config',
    'paramètres': 'config',
    'initialiser': 'init',
    'essaim': 'swarm',
    'agent': 'agent',
    'mémoire': 'memory',
    'workflow': 'workflow',
  },
  
  [SupportedLanguage.ES]: {
    'crear': 'create',
    'construir': 'build',
    'probar': 'test',
    'desplegar': 'deploy',
    'ayuda': 'help',
    'iniciar': 'start',
    'comenzar': 'start',
    'detener': 'stop',
    'parar': 'stop',
    'estado': 'status',
    'configuración': 'config',
    'ajustes': 'config',
    'inicializar': 'init',
    'enjambre': 'swarm',
    'agente': 'agent',
    'memoria': 'memory',
    'flujo': 'workflow',
  },
  
  [SupportedLanguage.PT]: {
    'criar': 'create',
    'construir': 'build',
    'testar': 'test',
    'implantar': 'deploy',
    'ajuda': 'help',
    'iniciar': 'start',
    'começar': 'start',
    'parar': 'stop',
    'estado': 'status',
    'configuração': 'config',
    'configurar': 'config',
    'inicializar': 'init',
    'enxame': 'swarm',
    'agente': 'agent',
    'memória': 'memory',
    'fluxo': 'workflow',
  },
  
  [SupportedLanguage.TR]: {
    'oluştur': 'create',
    'yarat': 'create',
    'inşa': 'build',
    'test': 'test',
    'dağıt': 'deploy',
    'yardım': 'help',
    'başlat': 'start',
    'durdur': 'stop',
    'durum': 'status',
    'ayar': 'config',
    'yapılandırma': 'config',
    'başlangıç': 'init',
    'sürü': 'swarm',
    'ajan': 'agent',
    'bellek': 'memory',
    'işakışı': 'workflow',
  },
  
  [SupportedLanguage.TH]: {
    'สร้าง': 'create',
    'สร้างขึ้น': 'build',
    'ทดสอบ': 'test',
    'ติดตั้ง': 'deploy',
    'ช่วยเหลือ': 'help',
    'เริ่ม': 'start',
    'หยุด': 'stop',
    'สถานะ': 'status',
    'ตั้งค่า': 'config',
    'เริ่มต้น': 'init',
    'ฝูง': 'swarm',
    'ตัวแทน': 'agent',
    'หน่วยความจำ': 'memory',
    'ขั้นตอน': 'workflow',
  },
  
  [SupportedLanguage.IT]: {
    'creare': 'create',
    'costruire': 'build',
    'testare': 'test',
    'distribuire': 'deploy',
    'aiuto': 'help',
    'avviare': 'start',
    'iniziare': 'start',
    'fermare': 'stop',
    'stato': 'status',
    'configurazione': 'config',
    'impostazioni': 'config',
    'inizializzare': 'init',
    'sciame': 'swarm',
    'agente': 'agent',
    'memoria': 'memory',
    'flusso': 'workflow',
  },
  
  [SupportedLanguage.HI]: {
    'बनाना': 'create',
    'निर्माण': 'build',
    'परीक्षण': 'test',
    'तैनात': 'deploy',
    'मदद': 'help',
    'सहायता': 'help',
    'शुरू': 'start',
    'प्रारंभ': 'start',
    'रोकें': 'stop',
    'बंद': 'stop',
    'स्थिति': 'status',
    'कॉन्फ़िग': 'config',
    'सेटिंग': 'config',
    'आरंभ': 'init',
    'झुंड': 'swarm',
    'एजेंट': 'agent',
    'मेमोरी': 'memory',
    'कार्यप्रवाह': 'workflow',
  },
};

/**
 * Common phrases and their command mappings
 */
const PHRASE_PATTERNS: Record<SupportedLanguage, Array<{ pattern: RegExp; command: string; action?: string }>> = {
  [SupportedLanguage.EN]: [
    { pattern: /create\s+(?:a\s+)?new\s+(\w+)/i, command: 'create', action: '$1' },
    { pattern: /build\s+(?:the\s+)?(\w+)/i, command: 'build', action: '$1' },
    { pattern: /show\s+me\s+(?:the\s+)?status/i, command: 'status' },
    { pattern: /help\s+(?:me\s+)?(?:with\s+)?(\w+)?/i, command: 'help', action: '$1' },
  ],
  
  [SupportedLanguage.RU]: [
    { pattern: /создай(?:те)?\s+нов(?:ый|ую|ое)\s+(\w+)/i, command: 'create', action: '$1' },
    { pattern: /покажи(?:те)?\s+статус/i, command: 'status' },
    { pattern: /помоги(?:те)?\s+(?:с\s+)?(\w+)?/i, command: 'help', action: '$1' },
    { pattern: /запусти(?:те)?\s+(\w+)/i, command: 'start', action: '$1' },
  ],
  
  [SupportedLanguage.JA]: [
    { pattern: /新しい(\w+)を作成/i, command: 'create', action: '$1' },
    { pattern: /(\w+)をビルド/i, command: 'build', action: '$1' },
    { pattern: /ステータスを表示/i, command: 'status' },
    { pattern: /(\w+)について助けて/i, command: 'help', action: '$1' },
  ],
  
  // Add more phrase patterns for other languages...
};

/**
 * Multilingual Command Parser
 */
export class MultilingualCommandParser {
  private languageManager: LanguageManager;
  private defaultLanguage: SupportedLanguage;
  
  constructor(
    private logger: ILogger,
    defaultLanguage: SupportedLanguage = SupportedLanguage.EN,
  ) {
    this.languageManager = new LanguageManager(logger);
    this.defaultLanguage = defaultLanguage;
  }
  
  /**
   * Parse command in any supported language
   */
  async parseCommand(input: string): Promise<{
    command: string;
    args: string[];
    flags: Record<string, any>;
    originalInput: string;
    detectedLanguage: SupportedLanguage;
    confidence: number;
  }> {
    // Detect language
    const detection = await this.languageManager.detectLanguage(input);
    const language = detection.language;
    
    // Normalize input
    const normalized = await this.languageManager.normalize(input, language);
    
    // Parse command using language-specific patterns
    const parsed = this.parseNativeCommand(normalized, language);
    
    // If no command found, try intent extraction
    if (!parsed.command) {
      const { intent } = await this.languageManager.extractIntent(normalized, language);
      parsed.command = this.mapIntentToCommand(intent);
    }
    
    return {
      ...parsed,
      originalInput: input,
      detectedLanguage: language,
      confidence: detection.confidence,
    };
  }
  
  /**
   * Parse native language command
   */
  private parseNativeCommand(
    input: string,
    language: SupportedLanguage,
  ): {
    command: string;
    args: string[];
    flags: Record<string, any>;
  } {
    const words = input.trim().split(/\s+/);
    let command = '';
    let args: string[] = [];
    const flags: Record<string, any> = {};
    
    // Check for direct command translations
    const translations = COMMAND_TRANSLATIONS[language];
    if (translations) {
      for (const word of words) {
        const translated = translations[word.toLowerCase()];
        if (translated) {
          command = translated;
          // Rest are arguments
          const cmdIndex = words.indexOf(word);
          args = words.slice(cmdIndex + 1);
          break;
        }
      }
    }
    
    // If no direct translation, check phrase patterns
    if (!command) {
      const patterns = PHRASE_PATTERNS[language];
      if (patterns) {
        for (const { pattern, command: cmd, action } of patterns) {
          const match = input.match(pattern);
          if (match) {
            command = cmd;
            if (action && match[1]) {
              args.push(match[1]);
            }
            break;
          }
        }
      }
    }
    
    // Parse flags (--flag or -f format)
    const flagArgs: string[] = [];
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('--')) {
        const flagName = arg.substring(2);
        const nextArg = args[i + 1];
        
        if (nextArg && !nextArg.startsWith('-')) {
          flags[flagName] = nextArg;
          i++; // Skip next arg
        } else {
          flags[flagName] = true;
        }
      } else if (arg.startsWith('-') && arg.length === 2) {
        // Short flag
        const flagName = arg.substring(1);
        flags[flagName] = true;
      } else {
        flagArgs.push(arg);
      }
    }
    
    return {
      command,
      args: flagArgs,
      flags,
    };
  }
  
  /**
   * Map intent to command
   */
  private mapIntentToCommand(intent: string): string {
    const intentMap: Record<string, string> = {
      'create': 'create',
      'build': 'build',
      'delete': 'remove',
      'update': 'update',
      'search': 'find',
      'help': 'help',
      'general': 'help',
    };
    
    return intentMap[intent] || 'help';
  }
  
  /**
   * Get command help in specific language
   */
  getCommandHelp(command: string, language: SupportedLanguage): string {
    const helpTexts: Record<string, Record<SupportedLanguage, string>> = {
      'create': {
        [SupportedLanguage.EN]: 'Create a new resource',
        [SupportedLanguage.RU]: 'Создать новый ресурс',
        [SupportedLanguage.JA]: '新しいリソースを作成',
        [SupportedLanguage.ZH_CN]: '创建新资源',
        [SupportedLanguage.ZH_TW]: '創建新資源',
        [SupportedLanguage.KO]: '새 리소스 만들기',
        [SupportedLanguage.DE]: 'Neue Ressource erstellen',
        [SupportedLanguage.FR]: 'Créer une nouvelle ressource',
        [SupportedLanguage.ES]: 'Crear un nuevo recurso',
        [SupportedLanguage.PT]: 'Criar um novo recurso',
        [SupportedLanguage.TR]: 'Yeni kaynak oluştur',
        [SupportedLanguage.TH]: 'สร้างทรัพยากรใหม่',
        [SupportedLanguage.IT]: 'Crea una nuova risorsa',
        [SupportedLanguage.HI]: 'नया संसाधन बनाएं',
      },
      // Add more help texts...
    };
    
    return helpTexts[command]?.[language] || helpTexts[command]?.[SupportedLanguage.EN] || 'No help available';
  }
  
  /**
   * Get all available commands in a specific language
   */
  getAvailableCommands(language: SupportedLanguage): Record<string, string> {
    const commands: Record<string, string> = {};
    const translations = COMMAND_TRANSLATIONS[language];
    
    if (translations) {
      // Invert the mapping to show native command -> English command
      for (const [native, english] of Object.entries(translations)) {
        commands[native] = english;
      }
    }
    
    return commands;
  }
  
  /**
   * Translate command to native language
   */
  translateCommand(command: string, targetLanguage: SupportedLanguage): string {
    const translations = COMMAND_TRANSLATIONS[targetLanguage];
    
    if (translations) {
      // Find the native translation for the English command
      for (const [native, english] of Object.entries(translations)) {
        if (english === command) {
          return native;
        }
      }
    }
    
    return command; // Return original if no translation found
  }
}