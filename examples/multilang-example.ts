/**
 * Claude Flow Multilang Framework - Usage Examples
 * Demonstrates multilingual AI orchestration capabilities
 */

import { PolyglotAgent } from '../src/polyglot/polyglot-agent.js';
import { SupportedLanguage } from '../src/polyglot/types.js';
import { WorkflowAggregate } from '../src/domain/workflow-aggregate.js';
import { MultilingualCommandParser } from '../src/cli/multilang-parser.js';
import { DocumentationSynchronizer } from '../src/doc-sync/synchronizer.js';
import { CulturalContextAnalyzer } from '../src/cultural/context-analyzer.js';
import { createPolyglotTools } from '../src/mcp/polyglot-tools.js';
import { ConsoleLogger } from '../src/core/logger.js';

// Initialize logger
const logger = new ConsoleLogger('multilang-example');

/**
 * Example 1: Polyglot Agent - Process commands in native languages
 */
async function polyglotAgentExample() {
  console.log('\n=== Polyglot Agent Example ===\n');
  
  // Create a polyglot agent
  const agent = new PolyglotAgent(
    'GlobalAssistant',
    ['development', 'translation', 'cultural-adaptation'],
    logger,
    SupportedLanguage.EN, // Primary language
  );
  
  // Process commands in different languages
  const examples = [
    { text: 'Create a new REST API with authentication', lang: SupportedLanguage.EN },
    { text: 'Создай новый REST API с аутентификацией', lang: SupportedLanguage.RU },
    { text: '認証付きの新しいREST APIを作成してください', lang: SupportedLanguage.JA },
    { text: '创建一个带认证的新REST API', lang: SupportedLanguage.ZH_CN },
    { text: 'Erstellen Sie eine neue REST-API mit Authentifizierung', lang: SupportedLanguage.DE },
    { text: 'Crea una nueva API REST con autenticación', lang: SupportedLanguage.ES },
  ];
  
  for (const example of examples) {
    console.log(`\nProcessing in ${example.lang}: "${example.text}"`);
    
    const result = await agent.processInNativeLanguage(example.text, example.lang);
    
    console.log(`Response Language: ${result.language}`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Cultural Context: ${result.culturalContext?.formalityLevel}`);
    console.log(`Response: ${result.response.substring(0, 100)}...`);
  }
  
  // Generate multilingual responses
  console.log('\n--- Multilingual Response Generation ---');
  const prompt = 'Explain the benefits of microservices architecture';
  const languages = [SupportedLanguage.EN, SupportedLanguage.RU, SupportedLanguage.JA, SupportedLanguage.FR];
  
  const multiResponses = await agent.generateMultilingualResponse(prompt, languages);
  
  for (const [lang, response] of Object.entries(multiResponses)) {
    console.log(`\n${lang}: ${response.substring(0, 80)}...`);
  }
}

/**
 * Example 2: DDD Workflow with Multilingual Support
 */
async function dddWorkflowExample() {
  console.log('\n=== DDD Workflow Example ===\n');
  
  // Create a multilingual workflow aggregate
  const workflow = WorkflowAggregate.create(
    {
      [SupportedLanguage.EN]: 'E-Commerce Platform Development',
      [SupportedLanguage.RU]: 'Разработка платформы электронной коммерции',
      [SupportedLanguage.JA]: 'Eコマースプラットフォーム開発',
      [SupportedLanguage.ZH_CN]: '电子商务平台开发',
      [SupportedLanguage.DE]: 'E-Commerce-Plattform-Entwicklung',
    },
    {
      [SupportedLanguage.EN]: 'Full-stack e-commerce platform with microservices',
      [SupportedLanguage.RU]: 'Full-stack платформа электронной коммерции с микросервисами',
      [SupportedLanguage.JA]: 'マイクロサービスを使用したフルスタックEコマースプラットフォーム',
      [SupportedLanguage.ZH_CN]: '使用微服务的全栈电子商务平台',
      [SupportedLanguage.DE]: 'Full-Stack-E-Commerce-Plattform mit Microservices',
    },
    [SupportedLanguage.EN, SupportedLanguage.RU, SupportedLanguage.JA, SupportedLanguage.ZH_CN, SupportedLanguage.DE],
    {
      culturalAdaptation: true,
      autoTranslate: true,
    },
  );
  
  // Add multilingual workflow steps
  workflow.addStep(
    {
      [SupportedLanguage.EN]: 'Design System Architecture',
      [SupportedLanguage.RU]: 'Проектирование системной архитектуры',
      [SupportedLanguage.JA]: 'システムアーキテクチャの設計',
    },
    {
      [SupportedLanguage.EN]: 'Design microservices architecture with API gateway',
      [SupportedLanguage.RU]: 'Проектирование архитектуры микросервисов с API шлюзом',
      [SupportedLanguage.JA]: 'APIゲートウェイを使用したマイクロサービスアーキテクチャの設計',
    },
    'system-architect',
    ['architecture-design', 'microservices', 'api-gateway'],
  );
  
  workflow.addStep(
    {
      [SupportedLanguage.EN]: 'Implement User Service',
      [SupportedLanguage.RU]: 'Реализация сервиса пользователей',
      [SupportedLanguage.JA]: 'ユーザーサービスの実装',
    },
    {
      [SupportedLanguage.EN]: 'Implement user authentication and management service',
      [SupportedLanguage.RU]: 'Реализация сервиса аутентификации и управления пользователями',
      [SupportedLanguage.JA]: 'ユーザー認証と管理サービスの実装',
    },
    'backend-developer',
    ['nodejs', 'authentication', 'database'],
    ['step-1'], // Depends on architecture design
  );
  
  // Activate workflow
  workflow.activate();
  
  // Display workflow in different languages
  const displayLanguages = [SupportedLanguage.EN, SupportedLanguage.RU, SupportedLanguage.JA];
  
  for (const lang of displayLanguages) {
    console.log(`\n--- Workflow in ${lang} ---`);
    console.log(`Name: ${workflow.getName(lang)}`);
    console.log(`Description: ${workflow.getDescription(lang)}`);
    
    const json = workflow.toMultilingualJSON(lang);
    console.log(`Steps: ${json.steps.length}`);
    json.steps.forEach(step => {
      console.log(`  - ${step.name}: ${step.status}`);
    });
  }
  
  // Show workflow progress
  const progress = workflow.getProgress();
  console.log('\n--- Workflow Progress ---');
  console.log(`Total Steps: ${progress.total}`);
  console.log(`Completed: ${progress.completed} (${progress.percentage}%)`);
}

/**
 * Example 3: Multilingual Command Parser
 */
async function commandParserExample() {
  console.log('\n=== Multilingual Command Parser Example ===\n');
  
  const parser = new MultilingualCommandParser(logger);
  
  // Parse commands in different languages
  const commands = [
    'create new project --name MyApp --type react',
    'создай новый проект --name MyApp --type react',
    '新しいプロジェクトを作成 --name MyApp --type react',
    '创建新项目 --name MyApp --type react',
    'erstellen neues Projekt --name MyApp --type react',
    'créer nouveau projet --name MyApp --type react',
    'crear nuevo proyecto --name MyApp --type react',
  ];
  
  for (const cmd of commands) {
    console.log(`\nParsing: "${cmd}"`);
    
    const parsed = await parser.parseCommand(cmd);
    
    console.log(`  Detected Language: ${parsed.detectedLanguage}`);
    console.log(`  Command: ${parsed.command}`);
    console.log(`  Args: ${JSON.stringify(parsed.args)}`);
    console.log(`  Flags: ${JSON.stringify(parsed.flags)}`);
    console.log(`  Confidence: ${(parsed.confidence * 100).toFixed(1)}%`);
  }
  
  // Get available commands in different languages
  console.log('\n--- Available Commands by Language ---');
  const languages = [SupportedLanguage.RU, SupportedLanguage.JA, SupportedLanguage.DE];
  
  for (const lang of languages) {
    console.log(`\n${lang}:`);
    const commands = parser.getAvailableCommands(lang);
    Object.entries(commands).slice(0, 5).forEach(([native, english]) => {
      console.log(`  ${native} → ${english}`);
    });
  }
}

/**
 * Example 4: Cultural Context Analysis
 */
async function culturalContextExample() {
  console.log('\n=== Cultural Context Analysis Example ===\n');
  
  const analyzer = new CulturalContextAnalyzer(logger);
  
  // Business email examples in different cultures
  const businessScenarios = [
    {
      language: SupportedLanguage.EN,
      text: 'Hi John, Can we schedule a quick meeting tomorrow?',
    },
    {
      language: SupportedLanguage.JA,
      text: '山田様、お忙しいところ恐れ入りますが、明日お打ち合わせのお時間をいただけますでしょうか。',
    },
    {
      language: SupportedLanguage.DE,
      text: 'Sehr geehrter Herr Schmidt, könnten wir morgen ein Meeting vereinbaren?',
    },
    {
      language: SupportedLanguage.RU,
      text: 'Уважаемый Иван Петрович, могли бы мы назначить встречу на завтра?',
    },
  ];
  
  for (const scenario of businessScenarios) {
    console.log(`\n--- ${scenario.language} Business Context ---`);
    
    const context = await analyzer.analyze(scenario.language, scenario.text);
    
    console.log(`Text: "${scenario.text}"`);
    console.log(`Formality: ${context.formalityLevel}`);
    console.log(`Communication Style: ${context.businessEtiquette?.communicationStyle}`);
    console.log(`Decision Making: ${context.businessEtiquette?.decisionMaking}`);
    console.log(`Greeting Style: ${context.businessEtiquette?.greetingStyle}`);
    
    // Get recommendations
    const recommendations = analyzer.getCommunicationRecommendations(context);
    if (recommendations.length > 0) {
      console.log('Recommendations:');
      recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    
    // Format date and currency
    const date = new Date();
    const amount = 1234567.89;
    
    console.log(`Date Format: ${analyzer.formatDate(date, context)}`);
    console.log(`Number Format: ${analyzer.formatNumber(amount, context)}`);
    console.log(`Currency Format: ${analyzer.formatCurrency(amount, context)}`);
  }
}

/**
 * Example 5: Documentation Synchronization
 */
async function documentationSyncExample() {
  console.log('\n=== Documentation Synchronization Example ===\n');
  
  const synchronizer = new DocumentationSynchronizer(logger, './docs');
  
  // Initialize synchronizer (in real app, would scan actual docs)
  console.log('Initializing documentation synchronizer...');
  // await synchronizer.initialize(); // Would scan actual documentation
  
  // Example: Synchronize README across languages
  console.log('\nSynchronizing README.md across languages...');
  
  const syncOptions = {
    autoTranslate: true,
    preserveFormatting: true,
    culturalAdaptation: true,
    sectionLevel: true,
  };
  
  // Simulate synchronization (in real app, would work with actual files)
  const targetLanguages = [
    SupportedLanguage.RU,
    SupportedLanguage.JA,
    SupportedLanguage.ZH_CN,
    SupportedLanguage.DE,
    SupportedLanguage.FR,
  ];
  
  console.log(`Base Language: ${SupportedLanguage.EN}`);
  console.log(`Target Languages: ${targetLanguages.join(', ')}`);
  console.log('Sync Options:');
  console.log(`  - Auto Translate: ${syncOptions.autoTranslate}`);
  console.log(`  - Preserve Formatting: ${syncOptions.preserveFormatting}`);
  console.log(`  - Cultural Adaptation: ${syncOptions.culturalAdaptation}`);
  console.log(`  - Section Level Sync: ${syncOptions.sectionLevel}`);
  
  // Enable auto-sync for continuous synchronization
  console.log('\nEnabling auto-sync for README.md...');
  // await synchronizer.enableAutoSync('README.md', SupportedLanguage.EN, targetLanguages);
  
  console.log('Documentation synchronization configured!');
}

/**
 * Example 6: MCP Polyglot Tools
 */
async function mcpPolyglotToolsExample() {
  console.log('\n=== MCP Polyglot Tools Example ===\n');
  
  const tools = createPolyglotTools(logger);
  
  console.log('Available Polyglot MCP Tools:');
  tools.forEach(tool => {
    console.log(`  - ${tool.name}: ${tool.description}`);
  });
  
  // Example: Language detection tool
  const detectTool = tools.find(t => t.name === 'language_detect');
  if (detectTool) {
    console.log('\n--- Language Detection ---');
    
    const texts = [
      'Hello, how are you today?',
      'Привет, как дела?',
      'こんにちは、元気ですか？',
      'Bonjour, comment allez-vous?',
      '你好，你好吗？',
    ];
    
    for (const text of texts) {
      const result = await detectTool.handler({ text });
      console.log(`"${text}"`);
      console.log(`  → ${result.detectedLanguage} (${(result.confidence * 100).toFixed(1)}%)`);
    }
  }
  
  // Example: Cultural adaptation tool
  const culturalTool = tools.find(t => t.name === 'cultural_adapt');
  if (culturalTool) {
    console.log('\n--- Cultural Adaptation ---');
    
    const result = await culturalTool.handler({
      text: 'We need to finalize the contract by end of day',
      language: SupportedLanguage.JA,
      context: 'business',
    });
    
    console.log('Original: "We need to finalize the contract by end of day"');
    console.log(`Target Culture: ${result.language}`);
    console.log(`Formality Level: ${result.culturalContext.formalityLevel}`);
    console.log(`Suggested Greeting: ${result.suggestedGreeting}`);
    console.log('Recommendations:');
    result.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
}

/**
 * Main function to run all examples
 */
async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     Claude Flow Multilang Framework - Usage Examples        ║');
  console.log('║     Revolutionary Multilingual AI Orchestration             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  
  try {
    // Run examples
    await polyglotAgentExample();
    await dddWorkflowExample();
    await commandParserExample();
    await culturalContextExample();
    await documentationSyncExample();
    await mcpPolyglotToolsExample();
    
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    Examples Completed!                      ║');
    console.log('║   Claude Flow Multilang - AI Without Language Barriers      ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    
  } catch (error) {
    console.error('Error running examples:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  polyglotAgentExample,
  dddWorkflowExample,
  commandParserExample,
  culturalContextExample,
  documentationSyncExample,
  mcpPolyglotToolsExample,
};