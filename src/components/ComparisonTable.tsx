import React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

type ComparisonItem = {
  category: string;
  yourScore: number;
  industryAvg: number;
  difference: number;
};

type ComparisonTableProps = {
  items: ComparisonItem[];
  title?: string;
  className?: string;
};

const ComparisonTable = ({
  items = [
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
  ],
  title = "Industry Comparison",
  className,
}: ComparisonTableProps) => {
  const renderDifference = (difference: number) => {
    if (difference > 0) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>+{difference}%</span>
        </div>
      );
    } else if (difference < 0) {
      return (
        <div className="flex items-center text-red-600">
          <XCircle className="h-4 w-4 mr-1" />
          <span>{difference}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-amber-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>0%</span>
        </div>
      );
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Category</TableHead>
              <TableHead className="text-center">Your Score</TableHead>
              <TableHead className="text-center">Industry Avg</TableHead>
              <TableHead className="text-center">Difference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell className="text-center">{item.yourScore}%</TableCell>
                <TableCell className="text-center">
                  {item.industryAvg}%
                </TableCell>
                <TableCell className="text-center">
                  {renderDifference(item.difference)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;
