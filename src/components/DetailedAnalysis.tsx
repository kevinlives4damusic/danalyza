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
import { Download, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
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
  analysisData = {
    overall:
      "Your CV demonstrates solid professional experience but could benefit from more quantifiable achievements and clearer formatting.",
    strengths: [
      "Strong educational background with relevant qualifications",
      "Clear chronological work history",
      "Good use of industry-specific terminology",
      "Appropriate length and conciseness",
    ],
    weaknesses: [
      "Lack of quantifiable achievements and metrics",
      "Some formatting inconsistencies",
      "Generic skill descriptions",
      "Missing targeted keywords for ATS optimization",
    ],
    suggestions: [
      "Add 2-3 measurable achievements for each role",
      "Standardize formatting across all sections",
      "Replace generic skills with specific examples",
      "Include industry keywords from job descriptions",
      "Add a professional summary highlighting your unique value proposition",
    ],
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
  },
  onBack = () => console.log("Back button clicked"),
}: DetailedAnalysisProps) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "Professional Experience": true,
    Education: false,
    Skills: false,
    "Layout & Formatting": false,
  });

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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
              <CardDescription>
                A comprehensive evaluation of your CV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {typeof analysisData.overall === "string"
                  ? analysisData.overall
                  : Array.isArray(analysisData.overall)
                    ? analysisData.overall.join(". ")
                    : ""}
              </p>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Section-by-Section Analysis
            </h2>
            <div className="space-y-4">
              {analysisData.sections.map((section, index) => (
                <Card
                  key={index}
                  className="border-l-4"
                  style={{
                    borderLeftColor:
                      section.type === "strengths"
                        ? "#10b981"
                        : section.type === "weaknesses"
                          ? "#ef4444"
                          : section.type === "suggestions"
                            ? "#f59e0b"
                            : "#3b82f6",
                  }}
                >
                  <CardHeader
                    className="py-3 px-4 cursor-pointer"
                    onClick={() => toggleSection(section.title)}
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      {expandedSections[section.title] ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedSections[section.title] && (
                    <CardContent className="pt-0 px-4 pb-4">
                      {typeof section.content === "string" ? (
                        <p className="text-gray-700">{section.content}</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-2">
                          {Array.isArray(section.content) &&
                            section.content.map((item, idx) => (
                              <li key={idx} className="text-gray-700">
                                {item}
                              </li>
                            ))}
                        </ul>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-6">
          <ResultCard
            title="Your CV Strengths"
            type="strengths"
            content={analysisData.strengths}
            className="mb-6"
          />
          <Card>
            <CardHeader>
              <CardTitle>Why These Are Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                These elements of your CV stand out positively to recruiters and
                hiring managers. They effectively communicate your
                qualifications and experience in a way that enhances your
                candidacy.
              </p>
              <p className="text-gray-700">
                Continue to leverage these strengths while addressing the
                identified weaknesses to create an even more compelling CV.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weaknesses" className="space-y-6">
          <ResultCard
            title="Areas for Improvement"
            type="weaknesses"
            content={analysisData.weaknesses}
            className="mb-6"
          />
          <Card>
            <CardHeader>
              <CardTitle>Impact on Your Application</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                These weaknesses may reduce the effectiveness of your CV in
                competitive job markets. They could prevent your application
                from passing Applicant Tracking Systems (ATS) or fail to capture
                the attention of hiring managers.
              </p>
              <p className="text-gray-700">
                Addressing these issues will significantly improve your chances
                of securing interviews and standing out from other candidates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <ResultCard
            title="Recommended Improvements"
            type="suggestions"
            content={analysisData.suggestions}
            className="mb-6"
          />
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                These suggestions are prioritized based on their potential
                impact. Focus on implementing the top recommendations first to
                see the most significant improvements in your CV's
                effectiveness.
              </p>
              <p className="text-gray-700">
                Consider our professional CV creation service for comprehensive
                assistance in implementing these changes and optimizing your CV
                for your target roles.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
