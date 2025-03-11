import React, { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Download, ArrowLeft, ChevronDown, ChevronUp, CheckCircle, AlertCircle, LightbulbIcon } from "lucide-react";
import ResultCard from "./ResultCard";

type DetailedAnalysisProps = {
  analysisData?: {
    overall: string | string[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    sections: {
      title: string;
      content: string | string[];
      type: "overall" | "strengths" | "weaknesses" | "suggestions";
    }[];
  };
  onBack?: () => void;
};

const DetailedAnalysis = ({
  analysisData,
  onBack = () => console.log("Back button clicked"),
}: DetailedAnalysisProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  if (!analysisData) {
    return null;
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Summary
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1 text-center">
          Detailed CV Analysis
        </h1>
        <Button variant="outline" className="ml-auto">
          <Download className="h-5 w-5 mr-2" />
          Download Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 mb-6">
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
              <p className="text-gray-700">{analysisData.overall}</p>
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
                {analysisData.strengths?.map((strength, index) => (
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
                {analysisData.weaknesses?.map((weakness, index) => (
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
                {analysisData.suggestions?.map((suggestion, index) => (
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

      {analysisData.sections && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Section Analysis</h3>
          <div className="space-y-4">
            {analysisData.sections.map((section, index) => (
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

      <Separator className="my-8" />

      <div className="text-center">
        <p className="text-gray-500 mb-4">
          Need professional help implementing these suggestions?
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => (window.location.href = "/pricing")}
        >
          Upgrade to Professional CV Service
        </Button>
      </div>
    </div>
  );
};

export default DetailedAnalysis;
