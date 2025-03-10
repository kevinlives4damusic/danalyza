import React, { useState, useEffect } from "react";
import Header from "./Header";
import UploadSection from "./UploadSection";
import AnalysisResults from "./AnalysisResults";
import DetailedAnalysis from "./DetailedAnalysis";
import PremiumServiceCTA from "./PremiumServiceCTA";
import Footer from "./Footer";
import { getAllAnalyses } from "@/lib/storage";
import { useUser } from "./auth/UserContext";

const Home = () => {
  const [currentView, setCurrentView] = useState<
    "upload" | "results" | "detailed"
  >("upload");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previousAnalyses, setPreviousAnalyses] = useState<any[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { user } = useUser();

  // Fetch previous analyses when user changes
  useEffect(() => {
    const fetchAnalyses = async () => {
      if (user) {
        try {
          const analyses = await getAllAnalyses();
          setPreviousAnalyses(analyses);
        } catch (error) {
          console.error("Error fetching analyses:", error);
        }
      } else {
        setPreviousAnalyses([]);
      }
    };

    fetchAnalyses();
  }, [user]);

  // Handle file upload
  const handleFileUpload = async (uploadedFile: File, results: any) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);

    try {
      // Set the analysis results from the AI
      setAnalysisResults(results);
      setIsAnalyzing(false);
      setCurrentView("results");
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
    setAnalysisResults(null);
    setCurrentView("upload");
  };

  // Handle view previous analysis
  const handleViewPreviousAnalysis = async (analysisId: string) => {
    try {
      // Find the analysis in the previousAnalyses array
      const analysis = previousAnalyses.find(a => a.id === analysisId);
      if (analysis) {
        setAnalysisResults(analysis.results);
        setCurrentView("results");
      }
    } catch (error) {
      console.error("Error loading previous analysis:", error);
    }
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

              {user && previousAnalyses.length > 0 && (
                <div className="mt-8 w-full max-w-3xl">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Your Previous Analyses
                  </h2>
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <ul className="divide-y divide-gray-200">
                      {previousAnalyses.slice(0, 5).map((analysis) => (
                        <li key={analysis.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800">
                                {analysis.fileName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(analysis.date).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleViewPreviousAnalysis(analysis.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View Results
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

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
