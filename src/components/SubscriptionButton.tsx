import React from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { usePayment } from '@/lib/hooks/usePayment';
import { cn } from '@/lib/utils';

interface SubscriptionButtonProps {
  planId: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  children: React.ReactNode;
}

export function SubscriptionButton({
  planId,
  className,
  variant = 'default',
  children
}: SubscriptionButtonProps) {
  const { isLoading, handleSubscribe } = usePayment();

  return (
    <Button
      className={cn(className)}
      variant={variant}
      onClick={() => handleSubscribe(planId)}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
} 