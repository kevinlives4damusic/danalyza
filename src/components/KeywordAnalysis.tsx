import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

type KeywordItem = {
  word: string;
  count: number;
  relevance: "high" | "medium" | "low";
  missing?: boolean;
};

type KeywordAnalysisProps = {
  keywords: KeywordItem[];
  missingKeywords?: KeywordItem[];
  title?: string;
  className?: string;
};

const KeywordAnalysis = ({
  keywords = [
    { word: "project management", count: 3, relevance: "high" },
    { word: "leadership", count: 2, relevance: "high" },
    { word: "agile", count: 1, relevance: "medium" },
    { word: "communication", count: 4, relevance: "high" },
    { word: "problem-solving", count: 2, relevance: "medium" },
    { word: "teamwork", count: 3, relevance: "medium" },
    { word: "analytical", count: 1, relevance: "low" },
  ],
  missingKeywords = [
    { word: "scrum", count: 0, relevance: "high", missing: true },
    { word: "kanban", count: 0, relevance: "medium", missing: true },
    {
      word: "stakeholder management",
      count: 0,
      relevance: "high",
      missing: true,
    },
  ],
  title = "Keyword Analysis",
  className,
}: KeywordAnalysisProps) => {
  const getRelevanceColor = (relevance: string, missing?: boolean) => {
    if (missing) return "bg-red-100 text-red-800 border-red-200";

    switch (relevance) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Keywords found in your CV and their relevance to your industry
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Present Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="outline"
                className={cn(
                  "px-2 py-1 text-xs",
                  getRelevanceColor(keyword.relevance),
                )}
              >
                {keyword.word} ({keyword.count})
              </Badge>
            ))}
          </div>
        </div>

        {missingKeywords && missingKeywords.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">
              Missing Important Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={cn(
                    "px-2 py-1 text-xs",
                    getRelevanceColor(keyword.relevance, true),
                  )}
                >
                  {keyword.word}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordAnalysis;
