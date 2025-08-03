/**
 * Claude Flow Multilang Framework - Documentation Synchronizer
 * Synchronizes documentation across multiple languages
 */

import { SupportedLanguage, DocSyncMetadata, TranslationContext } from '../polyglot/types.js';
import { LanguageManager } from '../i18n/language-manager.js';
import { ILogger } from '../core/logger.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createHash } from 'crypto';

/**
 * Documentation file metadata
 */
interface DocFile {
  path: string;
  language: SupportedLanguage;
  content: string;
  hash: string;
  lastModified: Date;
  sections?: DocSection[];
}

/**
 * Documentation section for granular syncing
 */
interface DocSection {
  id: string;
  title: string;
  content: string;
  hash: string;
  translations?: Partial<Record<SupportedLanguage, string>>;
}

/**
 * Sync status for documentation
 */
interface SyncStatus {
  file: string;
  baseLanguage: SupportedLanguage;
  targetLanguages: SupportedLanguage[];
  status: 'synced' | 'outdated' | 'missing' | 'in-progress';
  sections?: {
    total: number;
    synced: number;
    outdated: number;
    missing: number;
  };
  lastSync?: Date;
}

/**
 * Documentation Synchronizer
 */
export class DocumentationSynchronizer {
  private languageManager: LanguageManager;
  private syncMetadata: Map<string, DocSyncMetadata>;
  private fileCache: Map<string, DocFile>;
  
  constructor(
    private logger: ILogger,
    private baseDir: string = './docs',
  ) {
    this.languageManager = new LanguageManager(logger);
    this.syncMetadata = new Map();
    this.fileCache = new Map();
  }
  
  /**
   * Initialize synchronizer with existing documentation
   */
  async initialize(): Promise<void> {
    try {
      // Scan documentation directory
      await this.scanDocumentationDirectory();
      
      // Load sync metadata
      await this.loadSyncMetadata();
      
      this.logger.info('Documentation synchronizer initialized', {
        files: this.fileCache.size,
        metadata: this.syncMetadata.size,
      });
    } catch (error) {
      this.logger.error('Failed to initialize documentation synchronizer', error);
      throw error;
    }
  }
  
  /**
   * Scan documentation directory for files
   */
  private async scanDocumentationDirectory(): Promise<void> {
    const languages = Object.values(SupportedLanguage);
    
    for (const lang of languages) {
      const langDir = path.join(this.baseDir, lang);
      
      try {
        const files = await this.scanDirectory(langDir);
        
        for (const file of files) {
          const content = await fs.readFile(file, 'utf-8');
          const hash = this.calculateHash(content);
          const stats = await fs.stat(file);
          
          const docFile: DocFile = {
            path: file,
            language: lang,
            content,
            hash,
            lastModified: stats.mtime,
            sections: this.extractSections(content),
          };
          
          this.fileCache.set(`${lang}:${path.relative(langDir, file)}`, docFile);
        }
      } catch (error) {
        // Language directory might not exist
        this.logger.debug(`Language directory not found: ${langDir}`);
      }
    }
  }
  
  /**
   * Recursively scan directory for markdown files
   */
  private async scanDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.scanDirectory(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist
    }
    
    return files;
  }
  
  /**
   * Load sync metadata from storage
   */
  private async loadSyncMetadata(): Promise<void> {
    const metadataFile = path.join(this.baseDir, '.sync-metadata.json');
    
    try {
      const content = await fs.readFile(metadataFile, 'utf-8');
      const metadata = JSON.parse(content);
      
      for (const [key, value] of Object.entries(metadata)) {
        this.syncMetadata.set(key, value as DocSyncMetadata);
      }
    } catch (error) {
      // Metadata file might not exist
      this.logger.debug('Sync metadata file not found');
    }
  }
  
  /**
   * Save sync metadata to storage
   */
  private async saveSyncMetadata(): Promise<void> {
    const metadataFile = path.join(this.baseDir, '.sync-metadata.json');
    const metadata: Record<string, DocSyncMetadata> = {};
    
    for (const [key, value] of this.syncMetadata.entries()) {
      metadata[key] = value;
    }
    
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
  }
  
  /**
   * Synchronize documentation across languages
   */
  async synchronize(
    baseFile: string,
    targetLanguages: SupportedLanguage[],
    options: {
      autoTranslate?: boolean;
      preserveFormatting?: boolean;
      culturalAdaptation?: boolean;
      sectionLevel?: boolean;
    } = {},
  ): Promise<SyncStatus> {
    const baseLanguage = await this.detectBaseLanguage(baseFile);
    const baseDoc = this.fileCache.get(`${baseLanguage}:${baseFile}`);
    
    if (!baseDoc) {
      throw new Error(`Base document not found: ${baseFile}`);
    }
    
    const status: SyncStatus = {
      file: baseFile,
      baseLanguage,
      targetLanguages,
      status: 'in-progress',
      sections: {
        total: baseDoc.sections?.length || 0,
        synced: 0,
        outdated: 0,
        missing: 0,
      },
    };
    
    // Update sync metadata
    const metadataKey = `${baseFile}:${baseLanguage}`;
    this.syncMetadata.set(metadataKey, {
      baseLanguage,
      targetLanguages,
      lastSyncTimestamp: new Date(),
      syncStatus: 'in-progress',
      versions: { [baseLanguage]: baseDoc.hash },
      autoSync: options.autoTranslate || false,
    });
    
    // Synchronize to each target language
    for (const targetLang of targetLanguages) {
      if (targetLang === baseLanguage) continue;
      
      await this.synchronizeToLanguage(
        baseDoc,
        targetLang,
        options,
        status,
      );
    }
    
    // Update final status
    status.status = this.calculateOverallStatus(status);
    status.lastSync = new Date();
    
    // Update metadata
    const updatedMetadata = this.syncMetadata.get(metadataKey)!;
    updatedMetadata.syncStatus = status.status;
    updatedMetadata.lastSyncTimestamp = status.lastSync;
    
    // Save metadata
    await this.saveSyncMetadata();
    
    return status;
  }
  
  /**
   * Synchronize document to a specific language
   */
  private async synchronizeToLanguage(
    baseDoc: DocFile,
    targetLanguage: SupportedLanguage,
    options: any,
    status: SyncStatus,
  ): Promise<void> {
    const targetKey = `${targetLanguage}:${path.basename(baseDoc.path)}`;
    let targetDoc = this.fileCache.get(targetKey);
    
    if (!targetDoc) {
      // Document doesn't exist in target language
      if (options.autoTranslate) {
        // Translate and create
        const translated = await this.translateDocument(
          baseDoc,
          targetLanguage,
          options,
        );
        
        await this.saveTranslatedDocument(translated, targetLanguage);
        status.sections!.synced++;
      } else {
        status.sections!.missing++;
      }
    } else {
      // Document exists, check if outdated
      if (options.sectionLevel && baseDoc.sections && targetDoc.sections) {
        // Section-level synchronization
        await this.synchronizeSections(
          baseDoc,
          targetDoc,
          targetLanguage,
          options,
          status,
        );
      } else {
        // File-level synchronization
        if (this.isOutdated(baseDoc, targetDoc)) {
          if (options.autoTranslate) {
            const translated = await this.translateDocument(
              baseDoc,
              targetLanguage,
              options,
            );
            
            await this.saveTranslatedDocument(translated, targetLanguage);
            status.sections!.synced++;
          } else {
            status.sections!.outdated++;
          }
        } else {
          status.sections!.synced++;
        }
      }
    }
  }
  
  /**
   * Synchronize at section level
   */
  private async synchronizeSections(
    baseDoc: DocFile,
    targetDoc: DocFile,
    targetLanguage: SupportedLanguage,
    options: any,
    status: SyncStatus,
  ): Promise<void> {
    if (!baseDoc.sections || !targetDoc.sections) return;
    
    const targetSectionMap = new Map(
      targetDoc.sections.map(s => [s.id, s]),
    );
    
    for (const baseSection of baseDoc.sections) {
      const targetSection = targetSectionMap.get(baseSection.id);
      
      if (!targetSection) {
        // Section missing in target
        if (options.autoTranslate) {
          const translated = await this.translateSection(
            baseSection,
            baseDoc.language,
            targetLanguage,
            options,
          );
          
          // Add to target document
          targetDoc.sections.push(translated);
          status.sections!.synced++;
        } else {
          status.sections!.missing++;
        }
      } else if (baseSection.hash !== targetSection.hash) {
        // Section outdated
        if (options.autoTranslate) {
          const translated = await this.translateSection(
            baseSection,
            baseDoc.language,
            targetLanguage,
            options,
          );
          
          // Update target section
          Object.assign(targetSection, translated);
          status.sections!.synced++;
        } else {
          status.sections!.outdated++;
        }
      } else {
        // Section in sync
        status.sections!.synced++;
      }
    }
    
    // Save updated target document
    if (options.autoTranslate) {
      await this.saveTranslatedDocument(targetDoc, targetLanguage);
    }
  }
  
  /**
   * Translate entire document
   */
  private async translateDocument(
    doc: DocFile,
    targetLanguage: SupportedLanguage,
    options: any,
  ): Promise<DocFile> {
    const context: TranslationContext = {
      sourceLanguage: doc.language,
      targetLanguage,
      culturalAdaptation: options.culturalAdaptation || false,
      preserveFormatting: options.preserveFormatting || true,
      domain: 'technical',
    };
    
    const translatedContent = await this.languageManager.translate(
      doc.content,
      context,
    );
    
    return {
      ...doc,
      language: targetLanguage,
      content: translatedContent,
      hash: this.calculateHash(translatedContent),
      lastModified: new Date(),
      sections: doc.sections ? await this.translateSections(
        doc.sections,
        doc.language,
        targetLanguage,
        options,
      ) : undefined,
    };
  }
  
  /**
   * Translate document sections
   */
  private async translateSections(
    sections: DocSection[],
    sourceLanguage: SupportedLanguage,
    targetLanguage: SupportedLanguage,
    options: any,
  ): Promise<DocSection[]> {
    const translated: DocSection[] = [];
    
    for (const section of sections) {
      translated.push(await this.translateSection(
        section,
        sourceLanguage,
        targetLanguage,
        options,
      ));
    }
    
    return translated;
  }
  
  /**
   * Translate a single section
   */
  private async translateSection(
    section: DocSection,
    sourceLanguage: SupportedLanguage,
    targetLanguage: SupportedLanguage,
    options: any,
  ): Promise<DocSection> {
    const context: TranslationContext = {
      sourceLanguage,
      targetLanguage,
      culturalAdaptation: options.culturalAdaptation || false,
      preserveFormatting: options.preserveFormatting || true,
      domain: 'technical',
    };
    
    const translatedContent = await this.languageManager.translate(
      section.content,
      context,
    );
    
    const translatedTitle = await this.languageManager.translate(
      section.title,
      context,
    );
    
    return {
      ...section,
      title: translatedTitle,
      content: translatedContent,
      hash: this.calculateHash(translatedContent),
      translations: {
        ...section.translations,
        [targetLanguage]: translatedContent,
      },
    };
  }
  
  /**
   * Save translated document to file system
   */
  private async saveTranslatedDocument(
    doc: DocFile,
    language: SupportedLanguage,
  ): Promise<void> {
    const langDir = path.join(this.baseDir, language);
    const filePath = path.join(langDir, path.basename(doc.path));
    
    // Ensure directory exists
    await fs.mkdir(langDir, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, doc.content, 'utf-8');
    
    // Update cache
    const cacheKey = `${language}:${path.basename(doc.path)}`;
    this.fileCache.set(cacheKey, doc);
    
    this.logger.info('Saved translated document', {
      language,
      file: filePath,
    });
  }
  
  /**
   * Extract sections from markdown content
   */
  private extractSections(content: string): DocSection[] {
    const sections: DocSection[] = [];
    const lines = content.split('\n');
    
    let currentSection: DocSection | null = null;
    let sectionContent: string[] = [];
    
    for (const line of lines) {
      if (line.startsWith('# ') || line.startsWith('## ')) {
        // New section
        if (currentSection) {
          currentSection.content = sectionContent.join('\n');
          currentSection.hash = this.calculateHash(currentSection.content);
          sections.push(currentSection);
        }
        
        const title = line.replace(/^#+\s*/, '');
        currentSection = {
          id: this.generateSectionId(title),
          title,
          content: '',
          hash: '',
        };
        sectionContent = [];
      } else if (currentSection) {
        sectionContent.push(line);
      }
    }
    
    // Add last section
    if (currentSection) {
      currentSection.content = sectionContent.join('\n');
      currentSection.hash = this.calculateHash(currentSection.content);
      sections.push(currentSection);
    }
    
    return sections;
  }
  
  /**
   * Generate section ID from title
   */
  private generateSectionId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  /**
   * Calculate hash for content
   */
  private calculateHash(content: string): string {
    return createHash('md5').update(content).digest('hex');
  }
  
  /**
   * Check if document is outdated
   */
  private isOutdated(baseDoc: DocFile, targetDoc: DocFile): boolean {
    return baseDoc.hash !== targetDoc.hash ||
           baseDoc.lastModified > targetDoc.lastModified;
  }
  
  /**
   * Detect base language from file path
   */
  private async detectBaseLanguage(file: string): Promise<SupportedLanguage> {
    // Check if file path contains language code
    for (const lang of Object.values(SupportedLanguage)) {
      if (file.includes(`/${lang}/`) || file.includes(`\\${lang}\\`)) {
        return lang;
      }
    }
    
    // Default to English
    return SupportedLanguage.EN;
  }
  
  /**
   * Calculate overall sync status
   */
  private calculateOverallStatus(status: SyncStatus): 'synced' | 'outdated' | 'missing' | 'in-progress' {
    if (!status.sections) return 'synced';
    
    const { synced, outdated, missing, total } = status.sections;
    
    if (synced === total) return 'synced';
    if (missing > 0) return 'missing';
    if (outdated > 0) return 'outdated';
    
    return 'in-progress';
  }
  
  /**
   * Get sync status for all documents
   */
  async getAllSyncStatus(): Promise<SyncStatus[]> {
    const statuses: SyncStatus[] = [];
    
    for (const [key, metadata] of this.syncMetadata.entries()) {
      const [file] = key.split(':');
      
      statuses.push({
        file,
        baseLanguage: metadata.baseLanguage,
        targetLanguages: metadata.targetLanguages,
        status: metadata.syncStatus,
        lastSync: metadata.lastSyncTimestamp,
      });
    }
    
    return statuses;
  }
  
  /**
   * Enable auto-sync for a document
   */
  async enableAutoSync(
    file: string,
    baseLanguage: SupportedLanguage,
    targetLanguages: SupportedLanguage[],
  ): Promise<void> {
    const metadataKey = `${file}:${baseLanguage}`;
    
    this.syncMetadata.set(metadataKey, {
      baseLanguage,
      targetLanguages,
      lastSyncTimestamp: new Date(),
      syncStatus: 'synced',
      versions: {},
      autoSync: true,
    });
    
    await this.saveSyncMetadata();
    
    this.logger.info('Auto-sync enabled', {
      file,
      baseLanguage,
      targetLanguages,
    });
  }
}