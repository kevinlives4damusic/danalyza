import React from "react";
import { cn } from "@/lib/utils";

type ScoreIndicatorProps = {
  score: number;
  label: string;
  maxScore?: number;
  className?: string;
};

const ScoreIndicator = ({
  score = 70,
  label = "Overall Score",
  maxScore = 100,
  className,
}: ScoreIndicatorProps) => {
  // Calculate percentage
  const percentage = (score / maxScore) * 100;

  // Determine color based on score
  const getColor = () => {
    if (percentage >= 80) return "text-green-500 bg-green-50 border-green-200";
    if (percentage >= 60) return "text-blue-500 bg-blue-50 border-blue-200";
    if (percentage >= 40) return "text-amber-500 bg-amber-50 border-amber-200";
    return "text-red-500 bg-red-50 border-red-200";
  };

  // Determine text description based on score
  const getDescription = () => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Improvement";
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 rounded-lg border",
        getColor(),
        className,
      )}
    >
      <div className="text-3xl font-bold mb-1">{score}</div>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className={cn("h-2.5 rounded-full", {
            "bg-green-500": percentage >= 80,
            "bg-blue-500": percentage >= 60 && percentage < 80,
            "bg-amber-500": percentage >= 40 && percentage < 60,
            "bg-red-500": percentage < 40,
          })}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs">{getDescription()}</div>
    </div>
  );
};

export default ScoreIndicator;
