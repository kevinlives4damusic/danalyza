import React, { useState } from "react";
import Header from "./Header";
import UploadSection from "./UploadSection";
import AnalysisResults from "./AnalysisResults";
import DetailedAnalysis from "./DetailedAnalysis";
import PremiumServiceCTA from "./PremiumServiceCTA";
import Footer from "./Footer";

const Home = () => {
  const [currentView, setCurrentView] = useState<
    "upload" | "results" | "detailed"
  >("upload");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Mock analysis results
  const analysisResults = {
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

  // Handle file upload
  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);

    try {
      // The actual processing happens in UploadSection component
      // Here we just need to update the UI state
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentView("results");
      }, 1000);
    } catch (error) {
      console.error("Error in CV analysis:", error);
      setIsAnalyzing(false);
    }
  };

  // Handle view detailed analysis
  const handleViewDetailed = () => {
    setCurrentView("detailed");
  };

  // Handle back to results
  const handleBackToResults = () => {
    setCurrentView("results");
  };

  // Handle upload new CV
  const handleUploadNew = () => {
    setFile(null);
    setCurrentView("upload");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-20 pb-10">
        <div className="container mx-auto px-4 py-8">
          {currentView === "upload" && (
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                CV Reviewer
              </h1>
              <p className="text-center text-gray-600 max-w-2xl mb-8">
                Upload your CV for instant AI-powered analysis and feedback. Get
                professional insights to improve your job prospects.
              </p>

              <UploadSection onFileUploaded={handleFileUpload} />

              <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="max-w-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    How It Works
                  </h2>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                    <li>Upload your CV in PDF format</li>
                    <li>Our AI analyzes content, structure, and formatting</li>
                    <li>
                      Receive detailed feedback and improvement suggestions
                    </li>
                    <li>Apply changes to enhance your job prospects</li>
                  </ol>
                </div>

                <div onClick={() => (window.location.href = "/pricing")}>
                  <PremiumServiceCTA className="cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {currentView === "results" && (
            <div>
              <AnalysisResults
                isLoading={isAnalyzing}
                results={analysisResults}
              />

              {!isAnalyzing && (
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
                  <button
                    onClick={handleViewDetailed}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    View Detailed Analysis
                  </button>

                  <button
                    onClick={handleUploadNew}
                    className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors"
                  >
                    Upload New CV
                  </button>

                  <div onClick={() => (window.location.href = "/pricing")}>
                    <PremiumServiceCTA className="mt-8 md:mt-0 cursor-pointer" />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === "detailed" && (
            <DetailedAnalysis
              analysisData={analysisResults}
              onBack={handleBackToResults}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
