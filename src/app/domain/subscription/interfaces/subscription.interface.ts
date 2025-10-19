export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: eSubscriptionStatus;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  price: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPreview {
  id: string;
  user_id: string;
  plan_id: string;
  status: eSubscriptionStatus;
  start_date: string;
  end_date?: string;
  price: number;
  currency: string;
}

export interface SubscriptionCreate {
  user_id: string;
  plan_id: string;
  status: eSubscriptionStatus;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  price: number;
  currency: string;
}

export interface SubscriptionUpdate {
  status?: eSubscriptionStatus;
  end_date?: string;
  auto_renew?: boolean;
  price?: number;
}

export interface SubscriptionDetails extends Subscription {
  // Add any additional fields that might be needed for detailed subscription view
  // This extends the base Subscription interface with more comprehensive data
}

export enum eSubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export enum eSubscriptionPlan {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}
