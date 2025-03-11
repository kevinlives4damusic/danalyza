import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Lightbulb, BarChart, BookOpen } from "lucide-react";

type ResultCardProps = {
  title: string;
  type: "overall" | "strengths" | "weaknesses" | "suggestions";
  content: string | string[];
  references?: {
    text: string;
    source: string;
    link?: string;
  }[];
  className?: string;
};

const ResultCard = ({
  title = "Analysis Result",
  type = "overall",
  content = "Your CV has been analyzed. Here are the results.",
  references = [],
  className,
}: ResultCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Define icon and color based on card type
  const getCardStyles = () => {
    switch (type) {
      case "overall":
        return {
          icon: <BarChart className="h-6 w-6 text-blue-500" />,
          headerClass: "bg-blue-50 border-b border-blue-100",
          iconClass: "bg-blue-100 text-blue-700",
          buttonClass: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
        };
      case "strengths":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          headerClass: "bg-green-50 border-b border-green-100",
          iconClass: "bg-green-100 text-green-700",
          buttonClass: "text-green-600 hover:text-green-700 hover:bg-green-50",
        };
      case "weaknesses":
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          headerClass: "bg-red-50 border-b border-red-100",
          iconClass: "bg-red-100 text-red-700",
          buttonClass: "text-red-600 hover:text-red-700 hover:bg-red-50",
        };
      case "suggestions":
        return {
          icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
          headerClass: "bg-amber-50 border-b border-amber-100",
          iconClass: "bg-amber-100 text-amber-700",
          buttonClass: "text-amber-600 hover:text-amber-700 hover:bg-amber-50",
        };
      default:
        return {
          icon: <BarChart className="h-6 w-6 text-gray-500" />,
          headerClass: "bg-gray-50 border-b border-gray-100",
          iconClass: "bg-gray-100 text-gray-700",
          buttonClass: "text-gray-600 hover:text-gray-700 hover:bg-gray-50",
        };
    }
  };

  const { icon, headerClass, iconClass, buttonClass } = getCardStyles();

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

  const renderReferences = () => {
    if (references.length === 0) {
      return <p className="text-gray-500 italic">No references available for this section.</p>;
    }

    return (
      <ul className="space-y-4">
        {references.map((ref, index) => (
          <li key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <p className="text-gray-700 mb-2">{ref.text}</p>
            <p className="text-sm text-gray-500">
              Source: {ref.link ? (
                <a href={ref.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {ref.source}
                </a>
              ) : (
                ref.source
              )}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className={cn("h-full bg-white overflow-hidden", className)}>
      <CardHeader className={cn("flex flex-row items-center gap-3", headerClass)}>
        <div className={cn("p-2 rounded-full", iconClass)}>{icon}</div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">{renderContent()}</CardContent>
      <CardFooter className="pt-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className={cn("flex items-center gap-2", buttonClass)}
            >
              <BookOpen className="h-4 w-4" />
              View References
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>References for {title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {renderReferences()}
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
