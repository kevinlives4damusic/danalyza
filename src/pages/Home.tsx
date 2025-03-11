import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, FileText, Zap, Target, Award } from "lucide-react";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { useUser } from "@/components/auth/UserContext";
import UploadSection from "@/components/UploadSection";
import AnalysisResults from "@/components/AnalysisResults";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<"upload" | "results" | "detailed">("upload");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "AI-Powered CV Analysis",
      description: "Get instant, detailed feedback on your CV using advanced AI technology.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "ATS Optimization",
      description: "Ensure your CV passes Applicant Tracking Systems with our smart recommendations.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Industry-Specific Insights",
      description: "Receive tailored advice based on your industry and target role.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Professional Scoring",
      description: "Get a comprehensive score and detailed breakdown of your CV's strengths.",
    },
  ];

  const handleFileUpload = async (uploadedFile: File, results: any) => {
    setIsAnalyzing(true);
    try {
      setAnalysisResults(results);
      setCurrentView("results");
    } catch (error) {
      console.error("Error analyzing file:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewDetailed = () => {
    setCurrentView("detailed");
  };

  const handleUploadNew = () => {
    setAnalysisResults(null);
    setCurrentView("upload");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Add floating banner for non-premium users */}
      {!user?.isPremium && <PromotionalBanner variant="floating" />}

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

              {/* Add inline banner for non-premium users after upload section */}
              {!user?.isPremium && (
                <div className="w-full max-w-3xl mb-8">
                  <PromotionalBanner variant="inline" />
                </div>
              )}

              <UploadSection onFileUploaded={handleFileUpload} />
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

                  {/* Add compact banner in results view for non-premium users */}
                  {!user?.isPremium && (
                    <PromotionalBanner variant="compact" className="ml-4" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home; 