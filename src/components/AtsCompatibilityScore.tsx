import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type AtsIssue = {
  issue: string;
  severity: "high" | "medium" | "low";
  fixed?: boolean;
};

type AtsCompatibilityScoreProps = {
  score: number;
  issues: AtsIssue[];
  className?: string;
};

const AtsCompatibilityScore = ({
  score = 65,
  issues = [
    { issue: "Missing job-specific keywords", severity: "high" },
    { issue: "Complex formatting may not parse correctly", severity: "medium" },
    { issue: "Tables used for layout", severity: "high" },
    {
      issue: "Headers/footers contain important information",
      severity: "medium",
    },
    { issue: "Non-standard section headings", severity: "low" },
  ],
  className,
}: AtsCompatibilityScoreProps) => {
  const getSeverityIcon = (severity: string, fixed?: boolean) => {
    if (fixed) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    switch (severity) {
      case "high":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "low":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-700 bg-red-50";
      case "medium":
        return "text-amber-700 bg-amber-50";
      case "low":
        return "text-blue-700 bg-blue-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  // Determine score color
  const getScoreColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>ATS Compatibility</span>
          <span className={cn("text-2xl font-bold", getScoreColor())}>
            {score}%
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How well your CV will perform with Applicant Tracking Systems
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {issues.map((issue, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-2 p-2 rounded",
                getSeverityClass(issue.severity),
              )}
            >
              {getSeverityIcon(issue.severity, issue.fixed)}
              <span className="text-sm">{issue.issue}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AtsCompatibilityScore;
