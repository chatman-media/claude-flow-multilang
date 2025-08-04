/**
 * Claude Flow Multilang Framework - Polyglot MCP Tools
 * Extended MCP tools with multilingual capabilities
 */

import { MCPTool } from '../utils/types.js';
import { ILogger } from '../core/logger.js';
import { SupportedLanguage, TranslationContext } from '../polyglot/types.js';
import { LanguageManager } from '../i18n/language-manager.js';
import { CulturalContextAnalyzer } from '../cultural/context-analyzer.js';

/**
 * Create polyglot-enhanced MCP tools
 */
export function createPolyglotTools(logger: ILogger): MCPTool[] {
  const languageManager = new LanguageManager(logger);
  const culturalAnalyzer = new CulturalContextAnalyzer(logger);

  return [
    // Language detection tool
    {
      name: 'language_detect',
      description: 'Detect language from text input with confidence scoring',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Text to analyze for language detection',
          },
          hint: {
            type: 'string',
            description: 'Optional hint about expected language',
            enum: Object.values(SupportedLanguage),
          },
        },
        required: ['text'],
      },
      handler: async (input: any) => {
        const { text, hint } = input;
        const result = await languageManager.detectLanguage(text);
        
        // If hint provided and matches, boost confidence
        if (hint && result.language === hint) {
          result.confidence = Math.min(1.0, result.confidence * 1.2);
        }
        
        return {
          detectedLanguage: result.language,
          confidence: result.confidence,
          alternatives: result.alternatives,
          script: result.script,
          hint: hint || null,
        };
      },
    },

    // Translation with cultural context
    {
      name: 'translate_context',
      description: 'Translate text with cultural adaptation and context awareness',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Text to translate',
          },
          targetLanguage: {
            type: 'string',
            description: 'Target language code',
            enum: Object.values(SupportedLanguage),
          },
          sourceLanguage: {
            type: 'string',
            description: 'Source language code (auto-detect if not provided)',
            enum: Object.values(SupportedLanguage),
          },
          culturalAdaptation: {
            type: 'boolean',
            description: 'Apply cultural adaptation',
            default: true,
          },
          domain: {
            type: 'string',
            description: 'Domain context for translation',
            enum: ['technical', 'business', 'casual', 'formal', 'creative'],
          },
          preserveFormatting: {
            type: 'boolean',
            description: 'Preserve original formatting',
            default: true,
          },
        },
        required: ['text', 'targetLanguage'],
      },
      handler: async (input: any) => {
        const { text, targetLanguage, sourceLanguage, culturalAdaptation, domain, preserveFormatting } = input;
        
        // Detect source language if not provided
        const sourceLang = sourceLanguage || (await languageManager.detectLanguage(text)).language;
        
        const context: TranslationContext = {
          sourceLanguage: sourceLang,
          targetLanguage,
          culturalAdaptation: culturalAdaptation ?? true,
          domain,
          preserveFormatting: preserveFormatting ?? true,
        };
        
        const translated = await languageManager.translate(text, context);
        
        // Get cultural context for target language
        const culturalContext = await culturalAnalyzer.analyze(targetLanguage, translated);
        
        return {
          originalText: text,
          translatedText: translated,
          sourceLanguage: sourceLang,
          targetLanguage,
          culturalContext: {
            formalityLevel: culturalContext.formalityLevel,
            communicationStyle: culturalContext.businessEtiquette?.communicationStyle,
            recommendations: culturalAnalyzer.getCommunicationRecommendations(culturalContext),
          },
          domain,
        };
      },
    },

    // Cultural context analysis
    {
      name: 'cultural_adapt',
      description: 'Analyze and adapt content for cultural appropriateness',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Text to analyze',
          },
          language: {
            type: 'string',
            description: 'Language/culture to adapt for',
            enum: Object.values(SupportedLanguage),
          },
          context: {
            type: 'string',
            description: 'Context of communication',
            enum: ['business', 'casual', 'formal', 'technical'],
          },
        },
        required: ['text', 'language'],
      },
      handler: async (input: any) => {
        const { text, language, context } = input;
        
        const culturalContext = await culturalAnalyzer.analyze(language, text);
        const sensitivity = culturalAnalyzer.checkCulturalSensitivity(text, culturalContext);
        const recommendations = culturalAnalyzer.getCommunicationRecommendations(culturalContext);
        
        return {
          language,
          culturalContext: {
            formalityLevel: culturalContext.formalityLevel,
            businessEtiquette: culturalContext.businessEtiquette,
            dateFormat: culturalContext.dateFormat,
            numberFormat: culturalContext.numberFormat,
            currencyFormat: culturalContext.currencyFormat,
          },
          sensitivity: {
            isSensitive: sensitivity.isSensitive,
            warnings: sensitivity.warnings,
          },
          recommendations,
          suggestedGreeting: culturalContext.businessEtiquette?.greetingStyle,
          context: context || 'general',
        };
      },
    },

    // Multilingual document generation
    {
      name: 'doc_generate_multilang',
      description: 'Generate documentation in multiple languages simultaneously',
      inputSchema: {
        type: 'object',
        properties: {
          title: {
            type: 'object',
            description: 'Title in multiple languages',
            additionalProperties: { type: 'string' },
          },
          content: {
            type: 'string',
            description: 'Main content to generate documentation from',
          },
          languages: {
            type: 'array',
            description: 'Target languages for documentation',
            items: {
              type: 'string',
              enum: Object.values(SupportedLanguage),
            },
          },
          format: {
            type: 'string',
            description: 'Documentation format',
            enum: ['markdown', 'html', 'json', 'yaml'],
            default: 'markdown',
          },
          includeExamples: {
            type: 'boolean',
            description: 'Include code examples',
            default: true,
          },
        },
        required: ['title', 'content', 'languages'],
      },
      handler: async (input: any) => {
        const { title, content, languages, format, includeExamples } = input;
        const docs: Record<string, any> = {};
        
        for (const lang of languages) {
          // Get title in target language
          const localizedTitle = title[lang] || title[SupportedLanguage.EN] || 'Documentation';
          
          // Translate content if needed
          let localizedContent = content;
          if (lang !== SupportedLanguage.EN) {
            const context: TranslationContext = {
              sourceLanguage: SupportedLanguage.EN,
              targetLanguage: lang,
              culturalAdaptation: true,
              domain: 'technical',
            };
            localizedContent = await languageManager.translate(content, context);
          }
          
          // Generate formatted documentation
          docs[lang] = formatDocumentation(
            localizedTitle,
            localizedContent,
            lang,
            format || 'markdown',
            includeExamples ?? true,
          );
        }
        
        return {
          documents: docs,
          languages,
          format: format || 'markdown',
          generatedAt: new Date().toISOString(),
        };
      },
    },

    // DDD model generation from multilingual specs
    {
      name: 'ddd_generate',
      description: 'Generate DDD domain models from multilingual specifications',
      inputSchema: {
        type: 'object',
        properties: {
          aggregateName: {
            type: 'object',
            description: 'Aggregate name in multiple languages',
            additionalProperties: { type: 'string' },
          },
          description: {
            type: 'object',
            description: 'Description in multiple languages',
            additionalProperties: { type: 'string' },
          },
          properties: {
            type: 'array',
            description: 'Domain properties',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: { type: 'string' },
                required: { type: 'boolean' },
                multilingual: { type: 'boolean' },
              },
            },
          },
          boundedContext: {
            type: 'string',
            description: 'DDD bounded context',
          },
          events: {
            type: 'array',
            description: 'Domain events',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'object' },
              },
            },
          },
        },
        required: ['aggregateName', 'properties', 'boundedContext'],
      },
      handler: async (input: any) => {
        const { aggregateName, description, properties, boundedContext, events } = input;
        
        // Generate TypeScript code for the aggregate
        const code = generateDDDAggregate(
          aggregateName,
          description || {},
          properties,
          boundedContext,
          events || [],
        );
        
        // Generate test code
        const testCode = generateDDDTests(aggregateName[SupportedLanguage.EN] || 'Aggregate');
        
        // Generate documentation
        const documentation = generateDDDDocumentation(
          aggregateName,
          description || {},
          properties,
          boundedContext,
        );
        
        return {
          aggregate: {
            name: aggregateName,
            boundedContext,
            code,
            testCode,
            documentation,
          },
          properties: properties.length,
          events: events?.length || 0,
          generatedFiles: [
            `${boundedContext}/domain/${aggregateName[SupportedLanguage.EN]}.ts`,
            `${boundedContext}/domain/${aggregateName[SupportedLanguage.EN]}.test.ts`,
            `${boundedContext}/domain/${aggregateName[SupportedLanguage.EN]}.md`,
          ],
        };
      },
    },

    // Documentation synchronization check
    {
      name: 'doc_sync',
      description: 'Check and synchronize documentation across languages',
      inputSchema: {
        type: 'object',
        properties: {
          baseLanguage: {
            type: 'string',
            description: 'Base language for comparison',
            enum: Object.values(SupportedLanguage),
            default: 'en',
          },
          targetLanguages: {
            type: 'array',
            description: 'Languages to sync',
            items: {
              type: 'string',
              enum: Object.values(SupportedLanguage),
            },
          },
          documents: {
            type: 'object',
            description: 'Documents to check by language',
            additionalProperties: { type: 'string' },
          },
          autoSync: {
            type: 'boolean',
            description: 'Automatically sync missing translations',
            default: false,
          },
        },
        required: ['targetLanguages', 'documents'],
      },
      handler: async (input: any) => {
        const { baseLanguage, targetLanguages, documents, autoSync } = input;
        const baseLang = baseLanguage || SupportedLanguage.EN;
        const baseDoc = documents[baseLang];
        
        if (!baseDoc) {
          throw new Error(`Base document for ${baseLang} not found`);
        }
        
        const syncStatus: Record<string, any> = {};
        const translations: Record<string, string> = {};
        
        for (const lang of targetLanguages) {
          if (lang === baseLang) continue;
          
          const targetDoc = documents[lang];
          
          if (!targetDoc) {
            syncStatus[lang] = 'missing';
            
            if (autoSync) {
              // Translate the base document
              const context: TranslationContext = {
                sourceLanguage: baseLang,
                targetLanguage: lang,
                culturalAdaptation: true,
                domain: 'technical',
                preserveFormatting: true,
              };
              translations[lang] = await languageManager.translate(baseDoc, context);
              syncStatus[lang] = 'synced';
            }
          } else {
            // Check if documents are in sync (simplified check)
            const baseLength = baseDoc.length;
            const targetLength = targetDoc.length;
            const difference = Math.abs(baseLength - targetLength) / baseLength;
            
            if (difference > 0.2) {
              syncStatus[lang] = 'outdated';
            } else {
              syncStatus[lang] = 'synced';
            }
          }
        }
        
        return {
          baseLanguage: baseLang,
          syncStatus,
          translations: autoSync ? translations : undefined,
          recommendation: Object.values(syncStatus).some(s => s !== 'synced')
            ? 'Documentation needs synchronization'
            : 'All documentation is synchronized',
        };
      },
    },

    // Extract intent in native language
    {
      name: 'intent_extract_multilang',
      description: 'Extract intent and entities from text in any supported language',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Text to analyze',
          },
          language: {
            type: 'string',
            description: 'Language of the text (auto-detect if not provided)',
            enum: Object.values(SupportedLanguage),
          },
        },
        required: ['text'],
      },
      handler: async (input: any) => {
        const { text, language } = input;
        
        // Detect language if not provided
        const lang = language || (await languageManager.detectLanguage(text)).language;
        
        // Normalize text
        const normalized = await languageManager.normalize(text, lang);
        
        // Extract intent
        const { intent, entities, confidence } = await languageManager.extractIntent(normalized, lang);
        
        return {
          originalText: text,
          normalizedText: normalized,
          language: lang,
          intent,
          entities,
          confidence,
        };
      },
    },
  ];
}

/**
 * Helper function to format documentation
 */
function formatDocumentation(
  title: string,
  content: string,
  language: SupportedLanguage,
  format: string,
  includeExamples: boolean,
): string {
  switch (format) {
    case 'markdown':
      return `# ${title}\n\n${content}${includeExamples ? '\n\n## Examples\n\n```typescript\n// Example code here\n```' : ''}`;
    
    case 'html':
      return `<h1>${title}</h1>\n<p>${content}</p>${includeExamples ? '<h2>Examples</h2>\n<pre><code>// Example code here</code></pre>' : ''}`;
    
    case 'json':
      return JSON.stringify({
        title,
        content,
        language,
        examples: includeExamples ? ['// Example code here'] : [],
      }, null, 2);
    
    case 'yaml':
      return `title: ${title}\ncontent: ${content}\nlanguage: ${language}\nexamples:\n  - // Example code here`;
    
    default:
      return content;
  }
}

/**
 * Generate DDD aggregate code
 */
function generateDDDAggregate(
  name: Record<string, string>,
  description: Record<string, string>,
  properties: any[],
  boundedContext: string,
  events: any[],
): string {
  const className = name[SupportedLanguage.EN] || 'Aggregate';
  
  return `/**
 * ${className} Aggregate
 * Bounded Context: ${boundedContext}
 */

import { AggregateRoot, EntityId, MultilingualString } from '../domain/base-domain';
import { SupportedLanguage } from '../polyglot/types';

export interface ${className}Props {
${properties.map(p => `  ${p.name}${p.required ? '' : '?'}: ${p.multilingual ? 'MultilingualString' : p.type};`).join('\n')}
}

export class ${className} extends AggregateRoot<${className}Props> {
  constructor(props: ${className}Props, id?: EntityId) {
    super(props, id);
  }

  // Domain methods here
}

${events.map(e => `
export class ${e.name} extends MultilingualDomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId, '${e.name}', ${JSON.stringify(e.description || {})});
  }
}`).join('\n')}`;
}

/**
 * Generate DDD test code
 */
function generateDDDTests(aggregateName: string): string {
  return `import { ${aggregateName} } from './${aggregateName}';

describe('${aggregateName}', () => {
  it('should create aggregate', () => {
    const aggregate = new ${aggregateName}({
      // props here
    });
    
    expect(aggregate).toBeDefined();
    expect(aggregate.id).toBeDefined();
  });
});`;
}

/**
 * Generate DDD documentation
 */
function generateDDDDocumentation(
  name: Record<string, string>,
  description: Record<string, string>,
  properties: any[],
  boundedContext: string,
): string {
  return `# ${name[SupportedLanguage.EN] || 'Aggregate'}

## Bounded Context
${boundedContext}

## Description
${description[SupportedLanguage.EN] || 'No description'}

## Properties
${properties.map(p => `- **${p.name}** (${p.type}): ${p.required ? 'Required' : 'Optional'}${p.multilingual ? ', Multilingual' : ''}`).join('\n')}
`;
}