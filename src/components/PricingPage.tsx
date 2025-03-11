import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X, Loader2 } from "lucide-react";
import { createCheckoutSession, getPolarPlans, PolarPlan } from "@/lib/polar";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import { SubscriptionButton } from "./SubscriptionButton";

const defaultPlans = [
  {
    id: "free",
    name: "Free",
    description: "Basic CV analysis for individuals",
    price: 0,
    interval: "month",
    features: [
      "Basic CV analysis",
      "ATS compatibility check",
      "3 analyses per month",
      "Basic keyword analysis",
      "Standard response time",
    ],
    notIncluded: [
      "Industry comparison",
      "Detailed section analysis",
      "Priority support",
      "Custom branding",
      "API access",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    description: "Advanced features for job seekers",
    price: 29,
    interval: "month",
    features: [
      "Everything in Free, plus:",
      "Unlimited CV analyses",
      "Industry comparison",
      "Detailed section analysis",
      "Priority support",
      "Export to PDF",
      "Interview preparation tips",
      "Custom keyword targeting",
    ],
    notIncluded: [
      "Custom branding",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solution for businesses",
    price: 199,
    interval: "month",
    features: [
      "Everything in Professional, plus:",
      "Custom branding",
      "API access",
      "Bulk CV analysis",
      "Team collaboration",
      "Analytics dashboard",
      "Dedicated account manager",
      "Custom integration options",
      "SLA guarantees",
    ],
  },
] as PolarPlan[];

const PricingPage = () => {
  const [plans, setPlans] = useState<PolarPlan[]>(defaultPlans);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const polarPlans = await getPolarPlans();
        if (polarPlans && polarPlans.length > 0) {
          setPlans(polarPlans);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        // Fallback to default plans if API fails
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (plan: PolarPlan) => {
    try {
      setLoading(true);

      if (!user) {
        // Save selected plan to session storage
        sessionStorage.setItem('selectedPlan', plan.id);
        navigate('/login');
        return;
      }

      if (plan.id === 'free') {
        // Handle free plan subscription
        navigate('/dashboard');
        return;
      }

      if (plan.id === 'enterprise') {
        // Open contact form or redirect to contact page
        navigate('/contact');
        return;
      }

      const successUrl = `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/pricing`;

      const session = await createCheckoutSession(plan.id, successUrl, cancelUrl);
      
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                plan.name === "Professional"
                  ? "border-2 border-blue-500 shadow-xl"
                  : "border border-gray-200"
              }`}
            >
              {plan.name === "Professional" && (
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
                    ${plan.price}
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
                  {(plan as any).notIncluded?.map((feature: string, index: number) => (
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
                  className={`w-full ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    plan.name === "Professional"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : plan.name === "Enterprise"
                      ? "bg-gray-900 hover:bg-gray-800"
                      : ""
                  }`}
                  variant={plan.name === "Professional" ? "default" : "outline"}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : plan.name === "Enterprise" ? (
                    "Contact Sales"
                  ) : plan.price === 0 ? (
                    "Get Started"
                  ) : (
                    `Start ${plan.name} Plan`
                  )}
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
              <h3 className="font-semibold text-lg mb-2">Bulk Processing</h3>
              <p className="text-gray-600">
                Analyze multiple CVs simultaneously with our batch processing feature
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Get detailed insights and trends across all analyzed CVs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
