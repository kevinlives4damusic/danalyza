export type Section = {
  title: string;
  type: "overall" | "strengths" | "weaknesses" | "suggestions";
  content: string | string[];
  references?: Reference[];
  score?: number;
};

export type Reference = {
  text: string;
  source: string;
  link?: string;
};

export type SectionScore = {
  name: string;
  value: number;
};

export type KeywordItem = {
  word: string;
  count: number;
  relevance: "high" | "medium" | "low";
  missing?: boolean;
};

export type AnalysisScores = {
  overall: number;
  content: number;
  formatting: number;
  relevance: number;
  atsCompatibility: number;
};

export type AnalysisResults = {
  overall: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  scores?: AnalysisScores;
  sections?: Section[];
  references?: {
    overall?: Reference[];
    strengths?: Reference[];
    weaknesses?: Reference[];
    suggestions?: Reference[];
  };
  sectionScores?: SectionScore[];
  industryComparison?: SectionScore[];
  keywords?: {
    present: KeywordItem[];
    missing: KeywordItem[];
  };
  summary?: string;
  improvements?: string[];
}; 