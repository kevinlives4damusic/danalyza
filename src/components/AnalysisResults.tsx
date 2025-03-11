import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ResultCard from "./ResultCard";
import AnalyticsChart from "./AnalyticsChart";
import ScoreIndicator from "./ScoreIndicator";
import ComparisonTable from "./ComparisonTable";
import KeywordAnalysis from "./KeywordAnalysis";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { CheckCircle, AlertCircle, LightbulbIcon, XCircle } from "lucide-react";
import { Progress } from "./ui/progress";

type Section = {
  title: string;
  type: "overall" | "strengths" | "weaknesses" | "suggestions";
  content: string | string[];
  references?: {
    text: string;
    source: string;
    link?: string;
  }[];
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
    references?: {
      overall?: {
        text: string;
        source: string;
        link?: string;
      }[];
      strengths?: {
        text: string;
        source: string;
        link?: string;
      }[];
      weaknesses?: {
        text: string;
        source: string;
        link?: string;
      }[];
      suggestions?: {
        text: string;
        source: string;
        link?: string;
      }[];
    };
    sectionScores?: { name: string; value: number }[];
    industryComparison?: { name: string; value: number }[];
    summary: string;
    improvements: string[];
  };
  visible?: boolean;
  className?: string;
};

const AnalysisResults = ({
  isLoading = false,
  results,
  visible = true,
  className,
}: AnalysisResultsProps) => {
  const showAdvancedAnalytics = false;

  if (!visible || !results) {
    return null;
  }

  const strengths = results.strengths || [];
  const weaknesses = results.weaknesses || [];
  const suggestions = results.suggestions || [];
  const improvements = results.improvements || [];
  const sections = results.sections || [];

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50", className)}>
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
          {results.scores && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <ScoreIndicator
                score={results.scores.overall}
                label="Overall Score"
              />
              <ScoreIndicator
                score={results.scores.content}
                label="Content Quality"
              />
              <ScoreIndicator
                score={results.scores.formatting}
                label="Formatting"
              />
              <ScoreIndicator
                score={results.scores.relevance}
                label="Job Relevance"
              />
              <ScoreIndicator
                score={results.scores.atsCompatibility}
                label="ATS Compatibility"
              />
            </div>
          )}

          {/* Main Analysis Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="weaknesses">Areas to Improve</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{results.overall}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strengths">
              <Card>
                <CardHeader>
                  <CardTitle>Key Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weaknesses">
              <Card>
                <CardHeader>
                  <CardTitle>Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions">
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <LightbulbIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Advanced Analytics Section */}
          {showAdvancedAnalytics && sections && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Detailed Section Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Array.isArray(section.content) ? (
                        <ul className="space-y-2">
                          {section.content.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{section.content}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{results.summary}</p>
            </CardContent>
          </Card>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="text-gray-700">
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="text-gray-700">
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
