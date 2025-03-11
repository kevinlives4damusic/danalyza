import { useState, useEffect } from 'react';
import { useUser } from '@/components/auth/UserContext';
import { checkSubscriptionStatus } from '@/lib/polar';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface SubscriptionState {
  tier: SubscriptionTier;
  isLoading: boolean;
  error: string | null;
  features: {
    unlimitedAnalyses: boolean;
    industryComparison: boolean;
    detailedAnalysis: boolean;
    prioritySupport: boolean;
    pdfExport: boolean;
    interviewTips: boolean;
    customKeywords: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    bulkAnalysis: boolean;
    teamCollaboration: boolean;
    analytics: boolean;
    dedicatedManager: boolean;
  };
}

export function useSubscription() {
  const { user } = useUser();
  const [state, setState] = useState<SubscriptionState>({
    tier: 'free',
    isLoading: true,
    error: null,
    features: {
      unlimitedAnalyses: false,
      industryComparison: false,
      detailedAnalysis: false,
      prioritySupport: false,
      pdfExport: false,
      interviewTips: false,
      customKeywords: false,
      customBranding: false,
      apiAccess: false,
      bulkAnalysis: false,
      teamCollaboration: false,
      analytics: false,
      dedicatedManager: false,
    },
  });

  useEffect(() => {
    async function checkSubscription() {
      if (!user) {
        setState(prev => ({ ...prev, isLoading: false, tier: 'free' }));
        return;
      }

      try {
        const subscription = await checkSubscriptionStatus(user.id);
        
        // Map subscription plan to features
        const tier = subscription.planId as SubscriptionTier;
        const features = {
          unlimitedAnalyses: tier !== 'free',
          industryComparison: tier !== 'free',
          detailedAnalysis: tier !== 'free',
          prioritySupport: tier !== 'free',
          pdfExport: tier !== 'free',
          interviewTips: tier !== 'free',
          customKeywords: tier !== 'free',
          customBranding: tier === 'enterprise',
          apiAccess: tier === 'enterprise',
          bulkAnalysis: tier === 'enterprise',
          teamCollaboration: tier === 'enterprise',
          analytics: tier === 'enterprise',
          dedicatedManager: tier === 'enterprise',
        };

        setState({
          tier,
          isLoading: false,
          error: null,
          features,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load subscription status',
        }));
      }
    }

    checkSubscription();
  }, [user]);

  return state;
} 