import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ResultCard from "./ResultCard";
import AnalyticsChart from "./AnalyticsChart";
import ScoreIndicator from "./ScoreIndicator";
import ComparisonTable from "./ComparisonTable";
import KeywordAnalysis from "./KeywordAnalysis";
import AtsCompatibilityScore from "./AtsCompatibilityScore";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type Section = {
  title: string;
  type: "overall" | "strengths" | "weaknesses" | "suggestions";
  content: string | string[];
};

type AnalysisResultsProps = {
  isLoading?: boolean;
  results?: {
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
    sections?: Section[];
  };
  visible?: boolean;
  className?: string;
};

const AnalysisResults = ({
  isLoading = false,
  results = {
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
  },
  visible = true,
  className,
}: AnalysisResultsProps) => {
  // State for animation and expanded sections
  const [isVisible, setIsVisible] = useState(visible);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);

  // Sample data for charts
  const sectionScores = [
    { name: "Professional Experience", value: 75 },
    { name: "Education", value: 80 },
    { name: "Skills", value: 65 },
    { name: "Layout", value: 85 },
    { name: "ATS Compatibility", value: 62 },
  ];

  const industryComparison = [
    { name: "Your CV", value: results.scores?.overall || 72 },
    { name: "Industry Average", value: 68 },
    { name: "Top 10%", value: 92 },
  ];

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn("w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50", className)}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-lg text-gray-600 font-medium">
            Analyzing your CV...
          </p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              CV Analysis Results
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Based on our comprehensive analysis, here's how your CV performs
              and what you can do to improve it.
            </p>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <ScoreIndicator
              score={results.scores?.overall || 72}
              label="Overall Score"
            />
            <ScoreIndicator
              score={results.scores?.content || 68}
              label="Content Quality"
            />
            <ScoreIndicator
              score={results.scores?.formatting || 85}
              label="Formatting"
            />
            <ScoreIndicator
              score={results.scores?.relevance || 65}
              label="Job Relevance"
            />
            <ScoreIndicator
              score={results.scores?.atsCompatibility || 62}
              label="ATS Compatibility"
            />
          </div>

          {/* Main Analysis Tabs */}
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="comparison">Industry Comparison</TabsTrigger>
              <TabsTrigger value="ats">ATS Compatibility</TabsTrigger>
            </TabsList>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overall Assessment */}
                <ResultCard
                  title="Overall Assessment"
                  type="overall"
                  content={results.overall}
                />

                {/* Strengths */}
                <ResultCard
                  title="CV Strengths"
                  type="strengths"
                  content={results.strengths}
                />

                {/* Weaknesses */}
                <ResultCard
                  title="Areas for Improvement"
                  type="weaknesses"
                  content={results.weaknesses}
                />

                {/* Suggestions */}
                <ResultCard
                  title="Improvement Suggestions"
                  type="suggestions"
                  content={results.suggestions}
                />
              </div>
            </TabsContent>

            {/* Detailed Analysis Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalyticsChart
                  type="bar"
                  title="Section Performance"
                  description="How each section of your CV scores"
                  data={sectionScores}
                />

                <KeywordAnalysis 
                  title="Keyword Analysis" 
                  keywords={[
                    { word: "project management", count: 3, relevance: "high" },
                    { word: "leadership", count: 2, relevance: "high" },
                    { word: "communication", count: 4, relevance: "high" },
                    { word: "teamwork", count: 3, relevance: "medium" },
                  ]}
                />

                <div className="md:col-span-2">
                  {results.sections && results.sections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.sections.map((section, index) => (
                        <ResultCard
                          key={index}
                          title={section.title}
                          type={section.type}
                          content={section.content}
                        />
                      ))}
                    </div>
                  ) : (
                    <ComparisonTable 
                      title="Section-by-Section Analysis" 
                      items={[
                        {
                          category: "Professional Experience",
                          yourScore: 75,
                          industryAvg: 70,
                          difference: 5,
                        },
                        {
                          category: "Education",
                          yourScore: 80,
                          industryAvg: 75,
                          difference: 5,
                        },
                        {
                          category: "Skills",
                          yourScore: 65,
                          industryAvg: 80,
                          difference: -15,
                        },
                        {
                          category: "Layout & Formatting",
                          yourScore: 60,
                          industryAvg: 75,
                          difference: -15,
                        },
                      ]}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Industry Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalyticsChart
                  type="bar"
                  title="Industry Comparison"
                  description="How your CV compares to others in your industry"
                  data={industryComparison}
                />

                <AnalyticsChart
                  type="pie"
                  title="Competitive Analysis"
                  description="Your position relative to other applicants"
                  data={[
                    { name: "Above Average", value: 35 },
                    { name: "Average", value: 45 },
                    { name: "Below Average", value: 20 },
                  ]}
                />

                <div className="md:col-span-2">
                  <ComparisonTable 
                    title="Industry Standards Comparison" 
                    items={[
                      {
                        category: "Content Quality",
                        yourScore: results.scores?.content || 68,
                        industryAvg: 72,
                        difference: ((results.scores?.content || 68) - 72),
                      },
                      {
                        category: "Formatting",
                        yourScore: results.scores?.formatting || 85,
                        industryAvg: 78,
                        difference: ((results.scores?.formatting || 85) - 78),
                      },
                      {
                        category: "Relevance",
                        yourScore: results.scores?.relevance || 65,
                        industryAvg: 70,
                        difference: ((results.scores?.relevance || 65) - 70),
                      },
                      {
                        category: "ATS Compatibility",
                        yourScore: results.scores?.atsCompatibility || 62,
                        industryAvg: 68,
                        difference: ((results.scores?.atsCompatibility || 62) - 68),
                      },
                    ]}
                  />
                </div>
              </div>
            </TabsContent>

            {/* ATS Compatibility Tab */}
            <TabsContent value="ats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AtsCompatibilityScore 
                  score={results.scores?.atsCompatibility || 62}
                  issues={[
                    { issue: "Missing job-specific keywords", severity: "high" },
                    { issue: "Complex formatting may not parse correctly", severity: "medium" },
                    { issue: "Tables used for layout", severity: "high" },
                    { issue: "Headers/footers contain important information", severity: "medium" },
                    { issue: "Non-standard section headings", severity: "low" },
                  ]}
                />

                <KeywordAnalysis 
                  title="ATS Keyword Analysis" 
                  keywords={[
                    { word: "project management", count: 3, relevance: "high" },
                    { word: "leadership", count: 2, relevance: "high" },
                    { word: "communication", count: 4, relevance: "high" },
                    { word: "teamwork", count: 3, relevance: "medium" },
                  ]}
                  missingKeywords={[
                    { word: "scrum", count: 0, relevance: "high", missing: true },
                    { word: "kanban", count: 0, relevance: "medium", missing: true },
                    { word: "stakeholder management", count: 0, relevance: "high", missing: true },
                  ]}
                />

                <div className="md:col-span-2">
                  <ResultCard
                    title="ATS Improvement Recommendations"
                    type="suggestions"
                    content={[
                      "Use standard section headings (e.g., 'Experience', 'Education', 'Skills')",
                      "Avoid tables, headers, footers, and text boxes",
                      "Include keywords from the job description",
                      "Use a clean, simple format with standard fonts",
                      "Save your CV as a .docx or .pdf file",
                    ]}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => (window.location.href = "/pricing")}
            >
              View Comprehensive Analysis Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
