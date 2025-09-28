import { iPlan } from './plan.interface';

export interface iSubscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  status: eSubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: iPlan;
  createdAt: string;
  updatedAt: string;
}

export interface iSubscriptionCreate {
  priceId: string;
  paymentMethodId?: string;
}

export interface iSubscriptionUpdate {
  priceId: string;
  prorationBehavior?: 'create_prorations' | 'none';
}

export enum eSubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
}
