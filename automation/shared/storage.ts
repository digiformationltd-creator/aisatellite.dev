import fs from 'node:fs';
import path from 'node:path';
import type {
  DiscoveredResource,
  EvidenceRecord,
  TopicProposal,
  ArticleDraft,
} from './types.js';

export class StorageEngine {
  private baseDir: string;

  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
    this.ensureDirs();
  }

  private ensureDirs(): void {
    const dirs = [
      'candidates',
      'verified',
      'evidence',
      'topics',
      'drafts',
      'reports',
    ];
    for (const d of dirs) {
      const full = path.join(this.baseDir, 'data', d);
      if (!fs.existsSync(full)) {
        fs.mkdirSync(full, { recursive: true });
      }
    }
  }

  // --- Candidates ---
  saveCandidate(resource: DiscoveredResource): void {
    const filePath = path.join(this.baseDir, 'data', 'candidates', `${resource.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(resource, null, 2), 'utf8');
  }

  getCandidates(): DiscoveredResource[] {
    const dir = path.join(this.baseDir, 'data', 'candidates');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    return files.map((f) => {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      return JSON.parse(content) as DiscoveredResource;
    });
  }

  getCandidate(id: string): DiscoveredResource | null {
    const filePath = path.join(this.baseDir, 'data', 'candidates', `${id}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as DiscoveredResource;
  }

  // --- Verified Resources ---
  saveVerified(resource: DiscoveredResource): void {
    const filePath = path.join(this.baseDir, 'data', 'verified', `${resource.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(resource, null, 2), 'utf8');
  }

  getVerified(): DiscoveredResource[] {
    const dir = path.join(this.baseDir, 'data', 'verified');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    return files.map((f) => {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      return JSON.parse(content) as DiscoveredResource;
    });
  }

  // --- Evidence Records ---
  saveEvidence(record: EvidenceRecord): void {
    const filePath = path.join(this.baseDir, 'data', 'evidence', `${record.claimId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');
  }

  getEvidence(claimId: string): EvidenceRecord | null {
    const filePath = path.join(this.baseDir, 'data', 'evidence', `${claimId}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as EvidenceRecord;
  }

  getAllEvidence(): EvidenceRecord[] {
    const dir = path.join(this.baseDir, 'data', 'evidence');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    return files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  }

  // --- Topics ---
  saveTopic(topic: TopicProposal): void {
    const filePath = path.join(this.baseDir, 'data', 'topics', `${topic.topicId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(topic, null, 2), 'utf8');
  }

  getTopics(): TopicProposal[] {
    const dir = path.join(this.baseDir, 'data', 'topics');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    return files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  }

  // --- Drafts ---
  saveDraft(draft: ArticleDraft): void {
    const filePath = path.join(this.baseDir, 'data', 'drafts', `${draft.draftId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(draft, null, 2), 'utf8');
  }

  getDrafts(): ArticleDraft[] {
    const dir = path.join(this.baseDir, 'data', 'drafts');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    return files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  }

  getDraft(draftId: string): ArticleDraft | null {
    const filePath = path.join(this.baseDir, 'data', 'drafts', `${draftId}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ArticleDraft;
  }

  // --- Reports ---
  saveReport(name: string, data: any): void {
    const filePath = path.join(this.baseDir, 'data', 'reports', `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
