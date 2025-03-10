// Type definitions for PDF analysis results

export interface CVAnalysisResults {
  overall: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  scores?: {
    overall: number;
    content: number;
    formatting: number;
    relevance: number;
    atsCompatibility: number;
  };
  sections?: {
    title: string;
    content: string | string[];
    type: "overall" | "strengths" | "weaknesses" | "suggestions";
  }[];
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
