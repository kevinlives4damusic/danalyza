import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { FileText, Upload, Settings, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorBoundary from "@/components/ErrorBoundary";

interface Analysis {
  id: string;
  fileName: string;
  date: string;
  scores: {
    overall: number;
  };
}

const Dashboard = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch user's analyses
    const fetchAnalyses = async () => {
      try {
        // TODO: Implement fetching analyses from your backend
        setAnalyses([]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analyses:", error);
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [user, navigate]);

  const quickActions = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload New CV",
      description: "Analyze a new CV document",
      action: () => navigate("/upload"),
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Account Settings",
      description: "Manage your subscription and preferences",
      action: () => navigate("/settings"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you can perform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/upload")}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New CV
                </Button>
                {/* Other buttons */}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>Your most recent CV analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorBoundary>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-4">Loading your analyses...</p>
                    </div>
                  ) : analyses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {analyses.map((analysis) => (
                        <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <div>
                                  <CardTitle className="text-base">
                                    {analysis.fileName}
                                  </CardTitle>
                                  <CardDescription>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {new Date(analysis.date).toLocaleDateString()}
                                    </div>
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="text-lg font-semibold text-blue-600">
                                {analysis.scores.overall}%
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => navigate(`/analysis/${analysis.id}`)}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8">
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No analyses yet
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Upload your first CV to get started with our AI analysis
                          </p>
                          <Button onClick={() => navigate("/upload")}>
                            Upload Your CV
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ErrorBoundary>
              {/* Statistics content */}
            </ErrorBoundary>
          </div>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard; 