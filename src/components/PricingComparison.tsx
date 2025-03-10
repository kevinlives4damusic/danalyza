import React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type PricingComparisonProps = {
  className?: string;
};

type FeatureItem = {
  name: string;
  free: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
  category?: string;
};

const PricingComparison = ({ className }: PricingComparisonProps) => {
  const features: FeatureItem[] = [
    {
      category: "Analysis Features",
      name: "",
      free: false,
      standard: false,
      premium: false,
    },
    { name: "Basic CV Analysis", free: true, standard: true, premium: true },
    {
      name: "Strengths & Weaknesses Identification",
      free: true,
      standard: true,
      premium: true,
    },
    {
      name: "ATS Compatibility Check",
      free: "Basic",
      standard: "Advanced",
      premium: "Advanced",
    },
    {
      name: "Industry-Specific Keyword Analysis",
      free: false,
      standard: true,
      premium: true,
    },
    {
      name: "Detailed Section-by-Section Analysis",
      free: false,
      standard: true,
      premium: true,
    },
    {
      name: "Competitor Comparison",
      free: false,
      standard: false,
      premium: true,
    },

    {
      category: "Improvement Features",
      name: "",
      free: false,
      standard: false,
      premium: false,
    },
    {
      name: "Improvement Suggestions",
      free: "Limited",
      standard: "Comprehensive",
      premium: "Comprehensive",
    },
    {
      name: "Professional CV Creation",
      free: false,
      standard: false,
      premium: true,
    },
    {
      name: "Cover Letter Assistance",
      free: false,
      standard: false,
      premium: true,
    },
    {
      name: "LinkedIn Profile Optimization",
      free: false,
      standard: false,
      premium: true,
    },

    {
      category: "Usage & Support",
      name: "",
      free: false,
      standard: false,
      premium: false,
    },
    {
      name: "Monthly CV Uploads",
      free: "1",
      standard: "3",
      premium: "Unlimited",
    },
    { name: "Email Support", free: false, standard: true, premium: true },
    { name: "Priority Support", free: false, standard: false, premium: true },
    {
      name: "One-on-One Consultation",
      free: false,
      standard: false,
      premium: true,
    },
  ];

  const renderValue = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-sm">{value}</span>;
    }

    return value ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-gray-300 mx-auto" />
    );
  };

  return (
    <div className={cn("py-12 px-4", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Compare Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect plan for your career development needs
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table className="border rounded-lg">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-1/3">Features</TableHead>
                <TableHead className="text-center w-1/5">
                  <div className="font-bold text-lg">Free</div>
                  <div className="font-normal text-gray-500">R0/month</div>
                </TableHead>
                <TableHead className="text-center w-1/5 bg-blue-50">
                  <div className="font-bold text-lg text-primary">Standard</div>
                  <div className="font-normal text-gray-500">R50/month</div>
                </TableHead>
                <TableHead className="text-center w-1/5">
                  <div className="font-bold text-lg">Premium</div>
                  <div className="font-normal text-gray-500">R150/month</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature, index) => (
                <TableRow
                  key={index}
                  className={feature.category ? "bg-gray-50" : ""}
                >
                  <TableCell
                    className={
                      feature.category ? "font-bold text-gray-700" : ""
                    }
                  >
                    {feature.category || feature.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {!feature.category && renderValue(feature.free)}
                  </TableCell>
                  <TableCell className="text-center bg-blue-50">
                    {!feature.category && renderValue(feature.standard)}
                  </TableCell>
                  <TableCell className="text-center">
                    {!feature.category && renderValue(feature.premium)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell></TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = "/")}
                  >
                    Get Started
                  </Button>
                </TableCell>
                <TableCell className="text-center bg-blue-50">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => (window.location.href = "/")}
                  >
                    Upgrade Now
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = "/")}
                  >
                    Go Premium
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            All plans come with a 14-day money-back guarantee. No questions
            asked.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => (window.location.href = "/")}
          >
            View All Features
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingComparison;
