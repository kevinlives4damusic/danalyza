const POLAR_ACCESS_TOKEN = 'polar_oat_AVcEgAVHXgF8OlK7AN9WbrqfaRFR0ZW6VCEKu3k77FO';
const POLAR_PRODUCT_ID = 'd29af488-590f-488c-93b5-4cd87f7fc411';

export interface PolarPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export async function createCheckoutSession(planId: string, successUrl: string, cancelUrl: string) {
  try {
    const response = await fetch('https://api.polar.sh/v1/checkout/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${POLAR_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        product_id: POLAR_PRODUCT_ID,
        plan_id: planId,
        success_url: successUrl,
        cancel_url: cancelUrl,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function getPolarPlans() {
  try {
    const response = await fetch(`https://api.polar.sh/v1/products/${POLAR_PRODUCT_ID}/plans`, {
      headers: {
        'Authorization': `Bearer ${POLAR_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }

    const plans = await response.json();
    return plans;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
}

export async function checkSubscriptionStatus(userId: string) {
  try {
    const response = await fetch(`https://api.polar.sh/v1/subscriptions?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${POLAR_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check subscription status');
    }

    const subscription = await response.json();
    return subscription;
  } catch (error) {
    console.error('Error checking subscription:', error);
    throw error;
  }
} 