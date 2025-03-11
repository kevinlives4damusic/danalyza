// Type definitions for PDF analysis results

interface Keyword {
  word: string;
  count: number;
  relevance: "high" | "medium" | "low";
  missing?: boolean;
}

interface Section {
  title: string;
  content: string | string[];
  score: number;
}

interface Scores {
  overall: number;
  content: number;
  formatting: number;
  relevance: number;
  atsCompatibility: number;
}

interface SectionScore {
  name: string;
  value: number;
}

interface IndustryComparison {
  name: string;
  value: number;
}

export interface CVAnalysisResults {
  overall: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  scores: Scores;
  keywords: {
    present: Keyword[];
    missing: Keyword[];
  };
  sections: Section[];
  sectionScores: SectionScore[];
  industryComparison: IndustryComparison[];
}

export interface PDFExtractionResult {
  text: string;
  metadata?: {
    title?: string;
    author?: string;
    creationDate?: string;
    pageCount?: number;
  };
}
