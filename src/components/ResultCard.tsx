import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Lightbulb, BarChart } from "lucide-react";

type ResultCardProps = {
  title: string;
  type: "overall" | "strengths" | "weaknesses" | "suggestions";
  content: string | string[];
  className?: string;
};

const ResultCard = ({
  title = "Analysis Result",
  type = "overall",
  content = "Your CV has been analyzed. Here are the results.",
  className,
}: ResultCardProps) => {
  // Define icon and color based on card type
  const getCardStyles = () => {
    switch (type) {
      case "overall":
        return {
          icon: <BarChart className="h-6 w-6 text-blue-500" />,
          headerClass: "bg-blue-50 border-b border-blue-100",
          iconClass: "bg-blue-100 text-blue-700",
        };
      case "strengths":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          headerClass: "bg-green-50 border-b border-green-100",
          iconClass: "bg-green-100 text-green-700",
        };
      case "weaknesses":
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          headerClass: "bg-red-50 border-b border-red-100",
          iconClass: "bg-red-100 text-red-700",
        };
      case "suggestions":
        return {
          icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
          headerClass: "bg-amber-50 border-b border-amber-100",
          iconClass: "bg-amber-100 text-amber-700",
        };
      default:
        return {
          icon: <BarChart className="h-6 w-6 text-gray-500" />,
          headerClass: "bg-gray-50 border-b border-gray-100",
          iconClass: "bg-gray-100 text-gray-700",
        };
    }
  };

  const { icon, headerClass, iconClass } = getCardStyles();

  // Format content based on whether it's a string or array
  const renderContent = () => {
    if (typeof content === "string") {
      return <p className="text-gray-700">{content}</p>;
    } else if (Array.isArray(content)) {
      return (
        <ul className="list-disc pl-5 space-y-2">
          {content.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <Card className={cn("h-full bg-white overflow-hidden", className)}>
      <CardHeader
        className={cn("flex flex-row items-center gap-3", headerClass)}
      >
        <div className={cn("p-2 rounded-full", iconClass)}>{icon}</div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">{renderContent()}</CardContent>
    </Card>
  );
};

export default ResultCard;
