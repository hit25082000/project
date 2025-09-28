import { iBillingHistory } from './payment.interface';
import { iSubscription } from './subscription.interface';
export type {
  iSubscription,
  eSubscriptionStatus,
} from './subscription.interface';
export type { iBillingHistory, eInvoiceStatus } from './payment.interface';

export interface iUserRole {
  id: string;
  userId: string;
  role: eUserRole;
  stripeSubscriptionId?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum eUserRole {
  FREE = 'free',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}

export interface iBillingSummary {
  totalSpent: number;
  currency: string;
  subscriptionCount: number;
  activeSubscription?: iSubscription;
  lastPayment?: iBillingHistory;
  nextBillingDate?: string;
}

export interface iPaymentRecoveryAttempt {
  id: string;
  userId: string;
  subscriptionId: string;
  attemptNumber: number;
  status: 'pending' | 'succeeded' | 'failed';
  failureReason?: string;
  createdAt: string;
  scheduledFor?: string;
}
