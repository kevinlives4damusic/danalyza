import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadSection from "@/components/UploadSection";
import AnalysisResults from "@/components/AnalysisResults";

const Upload = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileUpload = async (file: File, results: any) => {
    setIsAnalyzing(true);
    try {
      setAnalysisResults(results);
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Error in CV analysis:", error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            CV Analysis
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mb-8">
            Upload your CV for instant AI-powered analysis and feedback. Get
            professional insights to improve your job prospects.
          </p>

          {!analysisResults ? (
            <UploadSection onFileUploaded={handleFileUpload} />
          ) : (
            <div className="w-full">
              <AnalysisResults
                isLoading={isAnalyzing}
                results={analysisResults}
              />
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setAnalysisResults(null)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Upload Another CV
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload; 