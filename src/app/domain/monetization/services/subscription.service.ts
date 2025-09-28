import { Injectable, inject, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { SubscriptionApi } from '../apis/subscription.api';
import { GlobalErrorHandler } from '@core/errors/global-error-handler';
import { NotificationService } from '@shared/services/notification.service';
import { SupabaseAuthService } from '@core/auth/supabase-auth.service';
import {
  iSubscription,
  iSubscriptionCreate,
} from '../interfaces/subscription.interface';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  // Dependencies
  private api = inject(SubscriptionApi);
  private authService = inject(SupabaseAuthService);
  private errorHandler = inject(GlobalErrorHandler);
  private notificationService = inject(NotificationService);

  // State management
  private readonly selectedSubscriptionId = signal<string | null>(null);

  // Resources
  private readonly subscriptionResource = rxResource({
    request: () => ({ userId: this.authService.currentUser()?.id }),
    loader: ({ userId }) =>
      userId
        ? from(this.api.getUserSubscription(userId))
        : from(Promise.resolve(null)),
  });

  // Public signals
  readonly subscription = computed(() => this.subscriptionResource.value());
  readonly isLoading = computed(() => this.subscriptionResource.isLoading());
  readonly error = computed(() => this.subscriptionResource.error());
  readonly isSubscribed = computed(() => {
    const sub = this.subscription();
    return sub?.status === 'active' || sub?.status === 'trialing';
  });

  // Actions
  async createSubscription(
    planId: string,
    paymentMethodId?: string
  ): Promise<{ subscriptionId: string; clientSecret: string }> {
    try {
      const subscriptionData: iSubscriptionCreate = {
        priceId: planId,
        paymentMethodId,
      };

      const result = await this.api.createSubscription(subscriptionData);
      this.notificationService.success('Subscription created successfully');

      // Refresh subscription data
      this.subscriptionResource.reload();

      return result;
    } catch (error) {
      this.errorHandler.handleError(error, 'Creating subscription');
      throw error;
    }
  }

  async upgradeSubscription(priceId: string): Promise<iSubscription> {
    try {
      const currentSub = this.subscription();
      if (!currentSub) throw new Error('No active subscription found');

      const updatedSubscription = await this.api.updateSubscription(
        currentSub.stripeSubscriptionId,
        {
          priceId,
          prorationBehavior: 'create_prorations', // Immediate upgrade
        }
      );

      this.notificationService.success('Subscription upgraded successfully');
      this.subscriptionResource.reload();

      return updatedSubscription;
    } catch (error) {
      this.errorHandler.handleError(error, 'Upgrading subscription');
      throw error;
    }
  }

  async downgradeSubscription(priceId: string): Promise<iSubscription> {
    try {
      const currentSub = this.subscription();
      if (!currentSub) throw new Error('No active subscription found');

      const updatedSubscription = await this.api.updateSubscription(
        currentSub.stripeSubscriptionId,
        {
          priceId,
          prorationBehavior: 'none', // Schedule for next cycle
        }
      );

      this.notificationService.success(
        'Subscription will be downgraded at the end of the current billing period'
      );
      this.subscriptionResource.reload();

      return updatedSubscription;
    } catch (error) {
      this.errorHandler.handleError(error, 'Downgrading subscription');
      throw error;
    }
  }

  async cancelSubscription(cancelAtPeriodEnd = true): Promise<void> {
    try {
      const currentSub = this.subscription();
      if (!currentSub) throw new Error('No active subscription found');

      await this.api.cancelSubscription(
        currentSub.stripeSubscriptionId,
        cancelAtPeriodEnd
      );

      const message = cancelAtPeriodEnd
        ? 'Subscription will be canceled at the end of the current billing period'
        : 'Subscription canceled immediately';

      this.notificationService.success(message);
      this.subscriptionResource.reload();
    } catch (error) {
      this.errorHandler.handleError(error, 'Canceling subscription');
      throw error;
    }
  }

  refresh(): void {
    this.subscriptionResource.reload();
  }
}
