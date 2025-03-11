import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '@/lib/polar';
import { useUser } from '@/components/auth/UserContext';
import { toast } from '@/components/ui/use-toast';

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSubscribe = async (planId: string) => {
    try {
      setIsLoading(true);

      if (!user) {
        // Save selected plan to session storage
        sessionStorage.setItem('selectedPlan', planId);
        navigate('/login');
        return;
      }

      if (planId === 'free') {
        navigate('/dashboard');
        return;
      }

      if (planId === 'enterprise') {
        navigate('/contact');
        return;
      }

      const successUrl = `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/pricing`;

      const session = await createCheckoutSession(planId, successUrl, cancelUrl);
      
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
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubscribe
  };
} 