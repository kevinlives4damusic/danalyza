import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

interface PromotionalBannerProps {
  className?: string;
  variant?: "inline" | "floating" | "compact";
}

export const PromotionalBanner = ({ 
  className = "", 
  variant = "inline" 
}: PromotionalBannerProps) => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useLocalStorage("promo-dismissed", false);
  const [isVisible, setIsVisible] = useState(!isDismissed);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleSubscribe = () => {
    navigate("/pricing");
  };

  if (variant === "compact") {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg shadow-md ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium">
            🚀 Special offer: R50/month for full access!
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSubscribe}
            className="whitespace-nowrap bg-white text-blue-600 hover:bg-blue-50"
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-4 right-4 max-w-sm bg-white rounded-xl shadow-lg border border-gray-200 p-4 ${className}`}>
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                🎉 Exclusive Launch Offer!
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Upgrade now for just R50/month and unlock premium features to supercharge your job search.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSubscribe}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-md ${className}`}>
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-white/80 hover:text-white"
      >
        <X size={20} />
      </button>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-semibold">
              🎉 Limited Time Launch Offer!
            </h3>
            <p className="text-white/90">
              Get full access to premium features for just R50/month. Enhance your CV, track your progress, and land your dream job faster!
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={handleSubscribe}
              className="whitespace-nowrap bg-white text-blue-600 hover:bg-blue-50"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 