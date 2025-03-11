import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { defaultPlans, YocoPlan } from "@/lib/yoco";
import { SubscriptionButton } from "./SubscriptionButton";

const PricingPage = () => {
  const [plans] = useState<YocoPlan[]>(defaultPlans);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get detailed CV analysis and improve your chances of landing your dream job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.name === "Premium"
                  ? "border-2 border-blue-500 shadow-xl"
                  : "border border-gray-200"
              }`}
            >
              {plan.name === "Premium" && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="min-h-[50px]">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    R{plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/{plan.interval}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="mt-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded?.map((feature, index) => (
                    <li key={index} className="flex items-start opacity-50">
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-6">
                <SubscriptionButton
                  planId={plan.id}
                  price={plan.price}
                  className={`w-full ${
                    plan.name === "Premium"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : plan.name === "Enterprise"
                      ? "bg-gray-900 hover:bg-gray-800"
                      : ""
                  }`}
                  variant={plan.name === "Premium" ? "default" : "outline"}
                >
                  {plan.name === "Enterprise" 
                    ? "Contact Sales"
                    : plan.price === 0 
                    ? "Get Started" 
                    : `Start ${plan.name} Plan`}
                </SubscriptionButton>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Enterprise Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Need a custom solution? Our enterprise plan includes additional features
            for businesses and organizations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Custom Integration</h3>
              <p className="text-gray-600">
                Integrate our CV analysis into your existing HR systems
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Team Management</h3>
              <p className="text-gray-600">
                Manage multiple team members and their access levels
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Priority Support</h3>
              <p className="text-gray-600">
                Get dedicated support and custom feature development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
