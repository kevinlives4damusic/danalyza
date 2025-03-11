import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkSubscriptionStatus } from "@/lib/polar";
import { useUser } from "@/components/auth/UserContext";
import { toast } from "@/components/ui/use-toast";

export function PaymentSuccess() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    async function verifySubscription() {
      if (!user || !sessionId) {
        setError("Invalid session or user not logged in");
        setIsVerifying(false);
        return;
      }

      try {
        const subscription = await checkSubscriptionStatus(user.id);
        
        if (subscription.status === "active") {
          toast({
            title: "Success!",
            description: "Your subscription has been activated.",
          });
          setIsVerifying(false);
        } else {
          setError("Subscription verification failed. Please contact support.");
          setIsVerifying(false);
        }
      } catch (error) {
        console.error("Error verifying subscription:", error);
        setError("Failed to verify subscription. Please try again or contact support.");
        setIsVerifying(false);
      }
    }

    verifySubscription();
  }, [user, sessionId]);

  if (isVerifying) {
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
        <div className="text-center max-w-md mx-auto px-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={() => navigate("/pricing")}
            >
              Return to Pricing
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = "mailto:support@example.com"}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-xl mx-auto px-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Premium!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your account has been upgraded successfully. You now have access to all premium features.
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
}

export default PaymentSuccess; 