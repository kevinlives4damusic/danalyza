import { saveAnalysis } from "./storage";

// API key for the PDF analysis service
const API_KEY = "sk-2dbead44ea2a40368e76f859a4372061";

// Function to extract text from PDF
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://api.pdfextractor.io/v1/extract", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`PDF extraction failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
}

// Function to analyze CV content
async function analyzeCV(text: string) {
  try {
    const response = await fetch("https://api.cvanalyzer.io/v1/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`CV analysis failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing CV:", error);
    // Return mock data for now
    return getMockAnalysisResults();
  }
}

// Function to get mock analysis results
function getMockAnalysisResults() {
  return {
    overall:
      "Your CV demonstrates a solid foundation with some areas for improvement. The layout is professional, but content could be enhanced for better impact.",
    strengths: [
      "Clear professional summary",
      "Good use of action verbs",
      "Consistent formatting",
      "Appropriate length",
    ],
    weaknesses: [
      "Lacks quantifiable achievements",
      "Some sections could be more concise",
      "Missing relevant keywords for ATS optimization",
      "Education section needs more structure",
    ],
    suggestions: [
      "Add metrics to demonstrate impact (e.g., increased sales by 20%)",
      "Tailor your CV for each job application",
      "Include a skills section with relevant technical and soft skills",
      "Ensure consistent tense usage throughout",
    ],
    scores: {
      overall: 72,
      content: 68,
      formatting: 85,
      relevance: 65,
      atsCompatibility: 62,
    },
    sections: [
      {
        title: "Professional Experience",
        type: "overall",
        content:
          "Your work experience section is well-structured but lacks quantifiable achievements. Consider adding metrics and specific outcomes to demonstrate your impact.",
      },
      {
        title: "Education",
        type: "strengths",
        content:
          "Your educational qualifications are clearly presented and relevant to your field. The chronological order and inclusion of key courses is effective.",
      },
      {
        title: "Skills",
        type: "weaknesses",
        content:
          "The skills section contains generic terms without context. Consider reorganizing into categories and providing specific examples of how you've applied these skills.",
      },
      {
        title: "Layout & Formatting",
        type: "suggestions",
        content: [
          "Use consistent font sizes and styles throughout",
          "Ensure proper alignment of all elements",
          "Add more white space between sections",
          "Use bullet points consistently",
        ],
      },
    ],
  };
}

// Main function to process CV file
export async function processCVFile(file: File) {
  try {
    // Step 1: Extract text from PDF
    const extractedText = await extractTextFromPDF(file);

    // Step 2: Analyze the extracted text
    const analysisResults = await analyzeCV(extractedText);

    // Step 3: Log analysis completion
    console.log("CV analysis completed for:", file.name);

    // Save to local storage instead of database
    saveAnalysis(file.name, file.size, analysisResults);

    return analysisResults;
  } catch (error) {
    console.error("Error processing CV file:", error);
    // Return mock data if real processing fails
    return getMockAnalysisResults();
  }
}
