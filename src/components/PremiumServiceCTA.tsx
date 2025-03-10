import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PremiumServiceCTAProps = {
  price?: string;
  benefits?: string[];
  ctaText?: string;
  className?: string;
};

const PremiumServiceCTA = ({
  price = "50 Rand",
  benefits = [
    "Professional CV formatting",
    "Industry-specific optimization",
    "ATS-friendly templates",
    "Unlimited revisions for 7 days",
    "24-hour turnaround time",
  ],
  ctaText = "Get Professional CV",
  className,
}: PremiumServiceCTAProps) => {
  return (
    <Card
      className={cn(
        "w-full max-w-[350px] overflow-hidden border-2 border-primary/20 bg-white",
        className,
      )}
    >
      <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-primary">
            Premium Service
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary font-medium"
          >
            {price}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Get your CV professionally crafted by experts
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2 pb-4">
        <Button className="w-full gap-2 group" size="lg">
          {ctaText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Satisfaction guaranteed or your money back
        </p>
      </CardFooter>
    </Card>
  );
};

export default PremiumServiceCTA;
