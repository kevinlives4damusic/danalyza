export interface AnalysisResults {
  text: string;
  summary?: string;
  skills?: string[];
  experience?: {
    title: string;
    company?: string;
    duration?: string;
    description?: string;
  }[];
  education?: {
    degree: string;
    institution?: string;
    year?: string;
  }[];
  recommendations?: string[];
} 