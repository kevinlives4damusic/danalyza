export interface YocoPayment {
  id: string;
  amount: number;
  currency: string;
  status: 'successful' | 'failed';
  metadata?: Record<string, any>;
}

export interface Subscription {
  id?: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  paymentId: string;
  amount: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VerifyPaymentRequest {
  token: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data?: YocoPayment;
  error?: string;
  subscription?: Subscription;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data?: Subscription;
  error?: string;
} 