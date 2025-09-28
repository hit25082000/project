import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  iSubscription,
  iSubscriptionCreate,
  iSubscriptionUpdate,
} from '../interfaces/subscription.interface';
import {
  GlobalErrorHandler,
  ApiError,
} from '@core/errors/global-error-handler';

@Injectable({ providedIn: 'root' })
export class SubscriptionApi {
  private supabase = inject(SupabaseClient);
  private errorHandler = inject(GlobalErrorHandler);

  async createSubscription(
    subscription: iSubscriptionCreate
  ): Promise<{ subscriptionId: string; clientSecret: string }> {
    try {
      const { data, error } = await this.supabase.functions.invoke(
        'subscriptions',
        {
          body: { action: 'create', ...subscription },
        }
      );

      if (error) {
        throw this.errorHandler.createApiError(error, 'create subscription');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'create subscription');
    }
  }

  async getUserSubscription(userId: string): Promise<iSubscription | null> {
    try {
      const { data, error } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw this.errorHandler.createApiError(error, 'get user subscription');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'get user subscription');
    }
  }

  async updateSubscription(
    subscriptionId: string,
    updates: iSubscriptionUpdate
  ): Promise<iSubscription> {
    try {
      const { data, error } = await this.supabase.functions.invoke(
        'subscriptions',
        {
          body: { action: 'update', subscriptionId, ...updates },
        }
      );

      if (error) {
        throw this.errorHandler.createApiError(error, 'update subscription');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'update subscription');
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd = true
  ): Promise<void> {
    try {
      const { error } = await this.supabase.functions.invoke('subscriptions', {
        body: { action: 'cancel', subscriptionId, cancelAtPeriodEnd },
      });

      if (error) {
        throw this.errorHandler.createApiError(error, 'cancel subscription');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'cancel subscription');
    }
  }
}
