import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { usePayment } from '@/lib/hooks/usePayment';
import { cn } from '@/lib/utils';

interface SubscriptionButtonProps {
  planId: string;
  price: number;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  children: React.ReactNode;
}

export function SubscriptionButton({
  planId,
  price,
  className,
  variant = 'default',
  children
}: SubscriptionButtonProps) {
  const { isLoading, handleSubscribe } = usePayment();

  return (
    <Button
      className={cn(className)}
      variant={variant}
      onClick={() => handleSubscribe(planId, price)}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        children
      )}
    </Button>
  );
} 