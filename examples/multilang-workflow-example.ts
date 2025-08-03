/**
 * Claude Flow Multilang - Complete Multilingual Workflow Example
 * Shows full integration of multilingual features with DDD
 */

import { WorkflowAggregate } from '../src/domain/workflow-aggregate.js';
import { SupportedLanguage } from '../src/polyglot/types.js';
import { PolyglotAgent } from '../src/polyglot/polyglot-agent.js';
import { LanguageManager } from '../src/i18n/language-manager.js';
import { CulturalContextAnalyzer } from '../src/cultural/context-analyzer.js';
import { MultilingualCommandParser } from '../src/polyglot/command-parser.js';
import { ConsoleLogger } from '../src/core/logger.js';

const logger = new ConsoleLogger('multilang-example');

/**
 * Example: Multilingual AI Assistant Workflow
 */
async function runMultilingualWorkflow() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     Multilingual AI Assistant Workflow                 ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: LANGUAGE DETECTION AND SETUP
  // ═══════════════════════════════════════════════════════════════
  
  console.log('🌍 Phase 1: Language Detection and Setup\n');
  
  const languageManager = new LanguageManager();
  await languageManager.initialize();
  
  // Test language detection
  const testPhrases = [
    { text: 'Hello, how can I help you?', expected: SupportedLanguage.EN },
    { text: 'Привет, как я могу помочь?', expected: SupportedLanguage.RU },
    { text: 'こんにちは、お手伝いできますか？', expected: SupportedLanguage.JA },
    { text: '你好，我能帮助你吗？', expected: SupportedLanguage.ZH_CN },
    { text: 'Bonjour, comment puis-je aider?', expected: SupportedLanguage.FR },
  ];
  
  for (const phrase of testPhrases) {
    const detected = await languageManager.detectLanguage(phrase.text);
    console.log(`  "${phrase.text}"`);
    console.log(`    Detected: ${detected} (Expected: ${phrase.expected}) ${detected === phrase.expected ? '✅' : '❌'}\n`);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: POLYGLOT AGENT INTERACTIONS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('🤖 Phase 2: Polyglot Agent Interactions\n');
  
  // Create agents for different languages
  const agents = {
    english: new PolyglotAgent('EnglishAssistant', ['general'], logger, SupportedLanguage.EN),
    russian: new PolyglotAgent('РусскийАссистент', ['general'], logger, SupportedLanguage.RU),
    japanese: new PolyglotAgent('日本語アシスタント', ['general'], logger, SupportedLanguage.JA),
    chinese: new PolyglotAgent('中文助手', ['general'], logger, SupportedLanguage.ZH_CN),
  };
  
  // Process commands in different languages
  const commands = [
    { lang: SupportedLanguage.EN, text: 'Create a new REST API with authentication' },
    { lang: SupportedLanguage.RU, text: 'Создай новый REST API с аутентификацией' },
    { lang: SupportedLanguage.JA, text: '認証付きの新しいREST APIを作成' },
    { lang: SupportedLanguage.ZH_CN, text: '创建带身份验证的新REST API' },
  ];
  
  for (const cmd of commands) {
    console.log(`Processing command in ${cmd.lang}:`);
    console.log(`  Input: "${cmd.text}"`);
    
    const agent = Object.values(agents).find(a => a.primaryLanguage === cmd.lang);
    if (agent) {
      const response = await agent.processInNativeLanguage(cmd.text);
      console.log(`  Language: ${response.language} (Confidence: ${response.confidence})`);
      console.log(`  Cultural Context: ${response.culturalContext?.formality || 'neutral'}\n`);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: CULTURAL CONTEXT ANALYSIS
  // ═══════════════════════════════════════════════════════════════
  
  console.log('🌏 Phase 3: Cultural Context Analysis\n');
  
  const culturalAnalyzer = new CulturalContextAnalyzer(logger);
  
  // Analyze business communication styles
  const businessLanguages = [
    SupportedLanguage.EN,
    SupportedLanguage.JA,
    SupportedLanguage.DE,
    SupportedLanguage.KO,
  ];
  
  for (const lang of businessLanguages) {
    const context = await culturalAnalyzer.analyze(
      lang,
      'We need to discuss the project deadline'
    );
    
    console.log(`Business Context for ${lang}:`);
    console.log(`  Formality: ${context.formality}`);
    console.log(`  Communication: ${context.businessEtiquette.communicationStyle}`);
    console.log(`  Decision Making: ${context.businessEtiquette.decisionMaking}`);
    console.log(`  Meeting Style: ${context.businessEtiquette.meetingStyle}`);
    console.log(`  Greeting: ${context.recommendations[0]}\n`);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: MULTILINGUAL COMMAND PARSING
  // ═══════════════════════════════════════════════════════════════
  
  console.log('⚙️ Phase 4: Multilingual Command Parsing\n');
  
  const commandParser = new MultilingualCommandParser(logger);
  
  // Parse commands in different languages
  const multilingualCommands = [
    'create project --name MyApp --language typescript',
    'создать проект --name МоеПриложение --language typescript',
    'プロジェクトを作成 --name アプリ --language typescript',
    '创建项目 --name 我的应用 --language typescript',
    'créer projet --name MonApp --language typescript',
    'projekt erstellen --name MeineApp --language typescript',
  ];
  
  for (const cmd of multilingualCommands) {
    const parsed = await commandParser.parseCommand(cmd);
    const lang = await languageManager.detectLanguage(cmd);
    console.log(`Command (${lang}): "${cmd}"`);
    console.log(`  Action: ${parsed.action}`);
    console.log(`  Subject: ${parsed.subject}`);
    console.log(`  Options: ${JSON.stringify(parsed.options)}\n`);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: MULTILINGUAL WORKFLOW ORCHESTRATION
  // ═══════════════════════════════════════════════════════════════
  
  console.log('🔄 Phase 5: Multilingual Workflow Orchestration\n');
  
  // Create a multilingual workflow
  const workflow = WorkflowAggregate.create(
    {
      [SupportedLanguage.EN]: 'Global Product Launch',
      [SupportedLanguage.RU]: 'Глобальный запуск продукта',
      [SupportedLanguage.JA]: 'グローバル製品ローンチ',
      [SupportedLanguage.ZH_CN]: '全球产品发布',
      [SupportedLanguage.FR]: 'Lancement mondial du produit',
      [SupportedLanguage.DE]: 'Globale Produkteinführung',
    },
    {
      [SupportedLanguage.EN]: 'Coordinate product launch across multiple markets',
      [SupportedLanguage.RU]: 'Координация запуска продукта на нескольких рынках',
      [SupportedLanguage.JA]: '複数市場での製品ローンチの調整',
      [SupportedLanguage.ZH_CN]: '协调多个市场的产品发布',
      [SupportedLanguage.FR]: 'Coordonner le lancement du produit sur plusieurs marchés',
      [SupportedLanguage.DE]: 'Koordination der Produkteinführung in mehreren Märkten',
    },
    [SupportedLanguage.EN, SupportedLanguage.RU, SupportedLanguage.JA, SupportedLanguage.ZH_CN]
  );
  
  // Add multilingual workflow steps
  workflow.addStep(
    {
      [SupportedLanguage.EN]: 'Market Research',
      [SupportedLanguage.RU]: 'Исследование рынка',
      [SupportedLanguage.JA]: '市場調査',
      [SupportedLanguage.ZH_CN]: '市场研究',
    },
    {
      [SupportedLanguage.EN]: 'Analyze target markets and customer preferences',
      [SupportedLanguage.RU]: 'Анализ целевых рынков и предпочтений клиентов',
      [SupportedLanguage.JA]: 'ターゲット市場と顧客の好みを分析',
      [SupportedLanguage.ZH_CN]: '分析目标市场和客户偏好',
    },
    'researcher',
    ['market-analysis', 'data-collection']
  );
  
  workflow.addStep(
    {
      [SupportedLanguage.EN]: 'Localization',
      [SupportedLanguage.RU]: 'Локализация',
      [SupportedLanguage.JA]: 'ローカリゼーション',
      [SupportedLanguage.ZH_CN]: '本地化',
    },
    {
      [SupportedLanguage.EN]: 'Adapt product for local markets',
      [SupportedLanguage.RU]: 'Адаптация продукта для местных рынков',
      [SupportedLanguage.JA]: '現地市場向けに製品を適応',
      [SupportedLanguage.ZH_CN]: '为本地市场调整产品',
    },
    'localizer',
    ['translation', 'cultural-adaptation'],
    ['step-1']
  );
  
  workflow.activate();
  
  // Display workflow in different languages
  console.log('Workflow Status in Different Languages:\n');
  
  const displayLanguages = [
    SupportedLanguage.EN,
    SupportedLanguage.RU,
    SupportedLanguage.JA,
    SupportedLanguage.ZH_CN,
  ];
  
  for (const lang of displayLanguages) {
    console.log(`[${lang}] ${workflow.getName(lang)}`);
    console.log(`  ${workflow.getDescription(lang)}`);
    console.log(`  Status: ${workflow.status}`);
    
    const steps = workflow.getSteps();
    steps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step.getName(lang)}`);
    });
    console.log('');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: CROSS-LANGUAGE COLLABORATION
  // ═══════════════════════════════════════════════════════════════
  
  console.log('🤝 Phase 6: Cross-Language Collaboration\n');
  
  // Simulate cross-language team collaboration
  const team = [
    { name: 'John', language: SupportedLanguage.EN, role: 'Product Manager' },
    { name: 'Алексей', language: SupportedLanguage.RU, role: 'Developer' },
    { name: '田中', language: SupportedLanguage.JA, role: 'Designer' },
    { name: '李明', language: SupportedLanguage.ZH_CN, role: 'QA Engineer' },
  ];
  
  console.log('Team Collaboration Messages:\n');
  
  for (const member of team) {
    const agent = new PolyglotAgent(
      member.name,
      ['collaboration'],
      logger,
      member.language
    );
    
    // Each team member sends a status update in their language
    const statusMessages = {
      [SupportedLanguage.EN]: 'Project is on track. Completed market analysis.',
      [SupportedLanguage.RU]: 'Разработка идет по плану. Завершен анализ требований.',
      [SupportedLanguage.JA]: 'デザインは順調です。UIモックアップが完成しました。',
      [SupportedLanguage.ZH_CN]: '测试计划已准备就绪。开始集成测试。',
    };
    
    const message = statusMessages[member.language] || 'Status update';
    const response = await agent.processInNativeLanguage(message);
    
    console.log(`${member.name} (${member.role}):`);
    console.log(`  Language: ${member.language}`);
    console.log(`  Message: "${message}"`);
    
    // Translate to English for team understanding
    if (member.language !== SupportedLanguage.EN) {
      const translation = await languageManager.translate(
        message,
        member.language,
        SupportedLanguage.EN
      );
      console.log(`  Translation: "${translation}"`);
    }
    console.log('');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 7: WORKFLOW COMPLETION
  // ═══════════════════════════════════════════════════════════════
  
  console.log('✅ Phase 7: Workflow Completion\n');
  
  // Complete workflow steps
  const step1 = workflow.getSteps()[0];
  if (step1) {
    workflow.startStep(step1.id.toString());
    workflow.completeStep(step1.id.toString(), {
      marketData: 'Analysis complete',
      recommendations: ['Focus on Asia-Pacific', 'Prioritize mobile experience'],
    });
  }
  
  const progress = workflow.getProgress();
  console.log('Workflow Progress:');
  console.log(`  Total Steps: ${progress.total}`);
  console.log(`  Completed: ${progress.completed}`);
  console.log(`  In Progress: ${progress.inProgress}`);
  console.log(`  Percentage: ${progress.percentage}%`);
  console.log('');
  
  // Display completion message in all languages
  console.log('Completion Messages:\n');
  
  const completionMessages = {
    [SupportedLanguage.EN]: '🎉 Workflow completed successfully!',
    [SupportedLanguage.RU]: '🎉 Рабочий процесс успешно завершен!',
    [SupportedLanguage.JA]: '🎉 ワークフローが正常に完了しました！',
    [SupportedLanguage.ZH_CN]: '🎉 工作流程成功完成！',
    [SupportedLanguage.FR]: '🎉 Flux de travail terminé avec succès!',
    [SupportedLanguage.DE]: '🎉 Workflow erfolgreich abgeschlossen!',
    [SupportedLanguage.ES]: '🎉 ¡Flujo de trabajo completado con éxito!',
    [SupportedLanguage.PT]: '🎉 Fluxo de trabalho concluído com sucesso!',
  };
  
  for (const [lang, message] of Object.entries(completionMessages)) {
    console.log(`[${lang}] ${message}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🌍 Claude Flow Multilang - Complete Workflow Example\n');
  
  try {
    await runMultilingualWorkflow();
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     Multilingual Workflow Example Completed!           ║');
    console.log('║     Breaking Language Barriers in AI Development       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('Error running multilingual workflow:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  runMultilingualWorkflow,
};