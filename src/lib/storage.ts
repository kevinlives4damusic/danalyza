// Local storage utility for CV analysis results

type StoredAnalysis = {
  id: string;
  fileName: string;
  fileSize: number;
  date: string;
  results: any;
};

// Save analysis to local storage
export const saveAnalysis = (
  fileName: string,
  fileSize: number,
  results: any,
): string => {
  const id = `analysis_${Date.now()}`;
  const analysis: StoredAnalysis = {
    id,
    fileName,
    fileSize,
    date: new Date().toISOString(),
    results,
  };

  // Get existing analyses
  const existingData = localStorage.getItem("cv_analyses");
  const analyses: StoredAnalysis[] = existingData
    ? JSON.parse(existingData)
    : [];

  // Add new analysis and save
  analyses.push(analysis);
  localStorage.setItem("cv_analyses", JSON.stringify(analyses));

  return id;
};

// Get all saved analyses
export const getAllAnalyses = (): StoredAnalysis[] => {
  const data = localStorage.getItem("cv_analyses");
  return data ? JSON.parse(data) : [];
};

// Get a specific analysis by ID
export const getAnalysisById = (id: string): StoredAnalysis | null => {
  const analyses = getAllAnalyses();
  return analyses.find((analysis) => analysis.id === id) || null;
};

// Delete an analysis
export const deleteAnalysis = (id: string): boolean => {
  const analyses = getAllAnalyses();
  const filteredAnalyses = analyses.filter((analysis) => analysis.id !== id);

  if (filteredAnalyses.length < analyses.length) {
    localStorage.setItem("cv_analyses", JSON.stringify(filteredAnalyses));
    return true;
  }

  return false;
};
