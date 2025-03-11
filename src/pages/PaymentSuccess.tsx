import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkSubscriptionStatus } from "@/lib/polar";
import { useAuth } from "@/lib/auth";

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifySubscription = async () => {
      if (!user || !sessionId) {
        setError("Invalid session");
        setLoading(false);
        return;
      }

      try {
        const subscription = await checkSubscriptionStatus(user.uid);
        if (subscription.status === "active") {
          // Update user's subscription status in your database if needed
          setLoading(false);
        } else {
          setError("Subscription verification failed");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error verifying subscription:", error);
        setError("Failed to verify subscription");
        setLoading(false);
      }
    };

    verifySubscription();
  }, [user, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Verifying your subscription...
          </h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">×</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate("/pricing")}>
            Return to Pricing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-xl mx-auto px-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for subscribing. Your account has been upgraded and you now have
          access to all premium features.
        </p>
        <div className="space-y-4">
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/upload")}
          >
            Analyze Your CV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 