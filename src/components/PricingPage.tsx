import React from "react";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
};

type PricingPageProps = {
  className?: string;
};

const PricingPage = ({ className }: PricingPageProps) => {
  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "R0",
      description: "Basic CV analysis for individuals",
      features: [
        "Basic CV analysis",
        "Strengths & weaknesses identification",
        "Limited improvement suggestions",
        "ATS compatibility check",
        "1 CV upload per month",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Standard",
      price: "R50",
      description: "Professional CV review and optimization",
      features: [
        "Comprehensive CV analysis",
        "Detailed strengths & weaknesses report",
        "Personalized improvement suggestions",
        "ATS optimization recommendations",
        "Industry-specific keyword analysis",
        "3 CV uploads per month",
        "Email support",
      ],
      buttonText: "Upgrade Now",
      popular: true,
    },
    {
      name: "Premium",
      price: "R150",
      description: "Complete CV creation and career services",
      features: [
        "Everything in Standard",
        "Professional CV creation",
        "Cover letter writing assistance",
        "LinkedIn profile optimization",
        "Unlimited CV uploads",
        "Industry comparison analytics",
        "Priority email support",
        "1 one-on-one consultation",
      ],
      buttonText: "Go Premium",
    },
  ];

  return (
    <div className={cn("py-16 px-4 bg-gray-50", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for your career goals. All plans
            include access to our AI-powered CV analysis tools.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col w-full max-w-sm border",
                tier.popular
                  ? "border-primary md:scale-105 relative z-10"
                  : "border-gray-200",
              )}
            >
              {tier.popular && (
                <div className="bg-primary text-primary-foreground text-sm font-medium py-1 text-center">
                  Most Popular
                </div>
              )}

              <div className="p-6 md:p-8 flex-grow">
                <h3 className="text-2xl font-bold text-gray-900">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /month
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{tier.description}</p>

                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100">
                <Button
                  className={cn(
                    "w-full",
                    tier.popular
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-gray-900 hover:bg-gray-800",
                  )}
                  onClick={() => (window.location.href = "/")}
                >
                  {tier.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll
                continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">
                How does the CV analysis work?
              </h3>
              <p className="text-gray-600">
                Our AI analyzes your CV for content quality, formatting, ATS
                compatibility, and industry relevance, providing actionable
                feedback.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and digital
                payment methods including PayPal.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">
                What's included in the professional CV creation?
              </h3>
              <p className="text-gray-600">
                Our team will create a professionally designed CV tailored to
                your industry, optimized for ATS systems, with compelling
                content.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-blue-50 rounded-xl p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Need a custom solution?
              </h2>
              <p className="text-gray-700">
                Contact us for enterprise pricing or custom career service
                packages for your organization.
              </p>
            </div>
            <Button
              size="lg"
              className="whitespace-nowrap bg-blue-600 hover:bg-blue-700"
              onClick={() => (window.location.href = "/")}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
