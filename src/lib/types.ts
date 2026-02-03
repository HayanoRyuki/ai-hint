// 型定義

export interface Domain {
  id: string;
  slug: string;
  name: string;
  nameJa: string;
  emoji: string;
  description?: string | null;
}

export interface Keyword {
  id: string;
  slug: string;
  name: string;
  category: string;
  description?: string | null;
}

export interface Faq {
  id: string;
  domainId: string;
  domain?: Domain;
  question: string;
  answer: string;
  keywords?: FaqWithKeyword[];
  status: 'draft' | 'published';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaqWithKeyword {
  keyword: Keyword;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DiagnosisResult {
  domain?: Domain;
  keywords: Keyword[];
  matchedFaqs: Faq[];
  summary: string;
}
