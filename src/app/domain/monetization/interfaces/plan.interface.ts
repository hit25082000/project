export interface iPlan {
  id: string;
  name: string;
  description: string;
  stripeProductId: string;
  stripePriceId: string;
  amount: number; // in cents
  currency: string;
  interval: 'month' | 'year';
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface iPlanPreview {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface iPlanCreate {
  name: string;
  description: string;
  stripeProductId: string;
  stripePriceId: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface iPlanUpdate {
  name?: string;
  description?: string;
  amount?: number;
  currency?: string;
  interval?: 'month' | 'year';
  isActive?: boolean;
  features?: string[];
}
