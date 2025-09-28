import { Injectable, inject, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { PaymentApi } from '../apis/payment.api';
import { StripeService } from '@shared/services/stripe.service';
import { RateLimiterService } from '@shared/services/rate-limiter.service';
import { GlobalErrorHandler } from '@core/errors/global-error-handler';
import { NotificationService } from '@shared/services/notification.service';
import { SupabaseAuthService } from '@core/auth/supabase-auth.service';
import { createSafeLogEntry } from '@shared/utils/security.utils';
import {
  iPaymentIntent,
  iBillingHistory,
} from '../interfaces/payment.interface';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  // Dependencies
  private api = inject(PaymentApi);
  private stripeService = inject(StripeService);
  private rateLimiter = inject(RateLimiterService);
  private authService = inject(SupabaseAuthService);
  private errorHandler = inject(GlobalErrorHandler);
  private notificationService = inject(NotificationService);

  // State management
  private readonly processingPayment = signal(false);

  // Resources
  private readonly billingHistoryResource = rxResource({
    request: () => ({ userId: this.authService.currentUser()?.id }),
    loader: ({ userId }) =>
      userId
        ? from(this.api.getBillingHistory(userId))
        : from(Promise.resolve({ history: [], total: 0 })),
  });

  // Public signals
  readonly billingHistory = computed(
    () => this.billingHistoryResource.value()?.history || []
  );
  readonly billingHistoryTotal = computed(
    () => this.billingHistoryResource.value()?.total || 0
  );
  readonly isLoadingHistory = computed(() =>
    this.billingHistoryResource.isLoading()
  );
  readonly historyError = computed(() => this.billingHistoryResource.error());
  readonly isProcessingPayment = computed(() => this.processingPayment());

  // Actions
  async processOneTimePayment(
    amount: number,
    currency = 'usd',
    metadata?: any
  ): Promise<boolean> {
    const userId = this.authService.currentUser()?.id;
    const rateLimitKey = `payment_${userId || 'anonymous'}`;

    // Check rate limiting
    if (!this.rateLimiter.canMakeRequest(rateLimitKey, 3, 300000)) {
      // 3 attempts per 5 minutes
      const remainingTime = Math.ceil(
        this.rateLimiter.getTimeUntilReset(rateLimitKey) / 1000 / 60
      );
      this.notificationService.error(
        `Too many payment attempts. Try again in ${remainingTime} minutes.`
      );
      return false;
    }

    this.processingPayment.set(true);

    // Create safe log entry
    const logEntry = createSafeLogEntry(
      'process_payment',
      { amount, currency, metadata },
      userId
    );
    console.log('Payment operation:', logEntry);

    try {
      // Create payment intent
      const paymentIntent = await this.api.createPaymentIntent(
        amount,
        currency,
        metadata
      );

      // Confirm payment with Stripe
      const stripe = await this.stripeService.getStripe();
      if (!stripe) throw new Error('Stripe not initialized');

      const { error } = await stripe.confirmPayment({
        clientSecret: paymentIntent.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        console.error(
          'Stripe payment error:',
          createSafeLogEntry('payment_error', { error: error.message }, userId)
        );
        this.notificationService.error(`Payment failed: ${error.message}`);
        return false;
      }

      this.notificationService.success('Payment processed successfully');
      this.billingHistoryResource.reload(); // Refresh history

      // Clear rate limit on success
      this.rateLimiter.clearRateLimit(rateLimitKey);

      return true;
    } catch (error) {
      console.error(
        'Payment processing error:',
        createSafeLogEntry(
          'payment_exception',
          { error: error.message },
          userId
        )
      );
      this.errorHandler.handleError(error, 'Processing payment');
      return false;
    } finally {
      this.processingPayment.set(false);
    }
  }

  async processRefund(paymentId: string, amount?: number): Promise<void> {
    try {
      await this.api.processRefund(paymentId, amount);
      this.notificationService.success('Refund processed successfully');
      this.billingHistoryResource.reload();
    } catch (error) {
      this.errorHandler.handleError(error, 'Processing refund');
      throw error;
    }
  }

  refreshHistory(): void {
    this.billingHistoryResource.reload();
  }
}
