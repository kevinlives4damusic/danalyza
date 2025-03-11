import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface Keyword {
  word: string;
  count: number;
  relevance: "high" | "medium" | "low";
  missing?: boolean;
}

interface KeywordAnalysisProps {
  title: string;
  keywords: Keyword[];
  missingKeywords?: Keyword[];
  className?: string;
}

const KeywordAnalysis = ({
  title,
  keywords,
  missingKeywords = [],
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
        <div className="space-y-4">
          {keywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Present Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className={cn(
                      "px-2 py-1 rounded-full text-sm border",
                      getRelevanceColor(keyword.relevance)
                    )}
                  >
                    {keyword.word} ({keyword.count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className={cn(
                      "px-2 py-1 rounded-full text-sm border",
                      getRelevanceColor(keyword.relevance, true)
                    )}
                  >
                    {keyword.word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordAnalysis;
