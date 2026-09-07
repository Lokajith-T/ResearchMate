import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data.json');

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  textContent: string;
  metadata: any;
  analysis: any;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  topic: string;
  paperIds: string[];
  lastUpdated: string;
}

export interface Gap {
  id: string;
  title: string;
  evidence: string;
  supportingPapers: string[];
  confidence: string;
  direction: string;
  createdAt: string;
}

interface DbState {
  papers: Paper[];
  collections: Collection[];
  gaps: Gap[];
}

export const db = {
  async read(): Promise<DbState> {
    try {
      const data = await fs.readFile(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return { papers: [], collections: [], gaps: [] };
    }
  },
  async write(data: DbState) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  },
  papers: {
    async create(paper: Omit<Paper, 'id' | 'createdAt'>) {
      const state = await db.read();
      const newPaper: Paper = {
        ...paper,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      state.papers = state.papers || [];
      state.papers.push(newPaper);
      await db.write(state);
      return newPaper;
    },
    async findMany() {
      const state = await db.read();
      return state.papers || [];
    },
    async findUnique(id: string) {
      const state = await db.read();
      return (state.papers || []).find(p => p.id === id);
    },
    async update(id: string, data: Partial<Paper>) {
      const state = await db.read();
      state.papers = state.papers || [];
      const index = state.papers.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Paper not found');
      state.papers[index] = { ...state.papers[index], ...data };
      await db.write(state);
      return state.papers[index];
    }
  },
  collections: {
    async findMany() {
      const state = await db.read();
      return state.collections || [];
    }
  },
  gaps: {
    async findMany() {
      const state = await db.read();
      return state.gaps || [];
    },
    async create(gap: Omit<Gap, 'id' | 'createdAt'>) {
      const state = await db.read();
      state.gaps = state.gaps || [];
      const newGap: Gap = {
        ...gap,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      state.gaps.push(newGap);
      await db.write(state);
      return newGap;
    }
  }
};
