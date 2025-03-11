import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { Button } from './ui/button';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumFeatureProps {
  feature: keyof ReturnType<typeof useSubscription>['features'];
  fallback?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PremiumFeature({
  feature,
  fallback,
  children,
  className
}: PremiumFeatureProps) {
  const { features, isLoading } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return null;
  }

  if (!features[feature]) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={cn("relative group", className)}>
        <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
          <div className="text-center p-4">
            <Lock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              This is a premium feature
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/pricing')}
            >
              Upgrade to Access
            </Button>
          </div>
        </div>
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 