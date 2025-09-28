import { Injectable, inject, signal, computed } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { PaymentService } from './payment.service';
import { SupabaseAuthService } from '@core/auth/supabase-auth.service';
import { GlobalErrorHandler } from '@core/errors/global-error-handler';
import { NotificationService } from '@shared/services/notification.service';
import {
  iBillingSummary,
  iPaymentRecoveryAttempt,
} from '../interfaces/billing.interface';

@Injectable({ providedIn: 'root' })
export class BillingService {
  // Dependencies
  private subscriptionService = inject(SubscriptionService);
  private paymentService = inject(PaymentService);
  private authService = inject(SupabaseAuthService);
  private errorHandler = inject(GlobalErrorHandler);
  private notificationService = inject(NotificationService);

  // Consolidated state
  readonly isLoading = computed(
    () =>
      this.subscriptionService.isLoading() ||
      this.paymentService.isLoadingHistory()
  );

  readonly hasBillingIssues = computed(() => {
    const subscription = this.subscriptionService.subscription();
    return (
      subscription?.status === 'past_due' || subscription?.status === 'unpaid'
    );
  });

  readonly billingStatus = computed(() => {
    const subscription = this.subscriptionService.subscription();
    const isSubscribed = this.subscriptionService.isSubscribed();

    if (!isSubscribed) return 'no_subscription';
    if (subscription?.status === 'active') return 'active';
    if (subscription?.status === 'trialing') return 'trial';
    if (subscription?.status === 'past_due') return 'payment_required';
    if (subscription?.status === 'canceled') return 'canceled';

    return 'unknown';
  });

  readonly billingSummary = computed((): iBillingSummary => {
    const subscription = this.subscriptionService.subscription();
    const billingHistory = this.paymentService.billingHistory();

    const totalSpent = billingHistory
      .filter((item) => item.status === 'paid')
      .reduce((total, item) => total + item.amount, 0);

    return {
      totalSpent,
      currency: billingHistory[0]?.currency || 'usd',
      subscriptionCount: subscription ? 1 : 0,
      activeSubscription: subscription,
      lastPayment: billingHistory.find((item) => item.status === 'paid'),
      nextBillingDate: subscription?.currentPeriodEnd,
    };
  });

  // Actions
  async handleFailedPayment(): Promise<void> {
    // Implement dunning management
    const subscription = this.subscriptionService.subscription();
    if (!subscription) return;

    // Log the failure for recovery tracking
    console.error(`Payment failed for subscription ${subscription.id}`);

    // Send notification about failed payment
    this.notificationService.error(
      'Your payment failed. Please update your payment method to continue your subscription.',
      'Payment Failed'
    );

    // Here you could implement automatic retry logic or escalation
    // For now, just notify the user
  }

  async sendBillingNotification(
    type:
      | 'payment_success'
      | 'payment_failed'
      | 'subscription_canceled'
      | 'trial_ending'
  ): Promise<void> {
    const messages = {
      payment_success: 'Your payment has been processed successfully.',
      payment_failed:
        'Your payment could not be processed. Please check your payment method.',
      subscription_canceled: 'Your subscription has been canceled.',
      trial_ending:
        'Your trial period is ending soon. Add a payment method to continue.',
    };

    this.notificationService.info(messages[type], 'Billing Update');
  }

  refreshAll(): void {
    this.subscriptionService.refresh();
    this.paymentService.refreshHistory();
  }
}
