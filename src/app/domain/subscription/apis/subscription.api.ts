import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  Subscription,
  SubscriptionPreview,
  SubscriptionCreate,
  SubscriptionUpdate,
  SubscriptionDetails,
  eSubscriptionStatus,
} from '../interfaces/subscription.interface';
import {
  ApiError,
  NotFoundError,
  ValidationError,
  GlobalErrorHandler,
} from '@shared/errors/global-error-handler';

@Injectable({ providedIn: 'root' })
export class SubscriptionApi {
  private supabase = inject(SupabaseClient);
  private errorHandler = inject(GlobalErrorHandler);

  /**
   * Get a list of subscriptions with optional search functionality
   * @param userId - Optional user ID to filter subscriptions
   * @param status - Optional status to filter subscriptions
   * @param limit - Optional limit for the number of results
   * @returns Promise<SubscriptionPreview[]> - List of subscription previews
   */
  async getSubscriptions(
    userId?: string,
    status?: eSubscriptionStatus,
    limit?: number
  ): Promise<SubscriptionPreview[]> {
    try {
      let query = this.supabase
        .from('subscriptions')
        .select(
          'id, user_id, plan_id, status, start_date, end_date, price, currency'
        )
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw this.errorHandler.createApiError(error, 'fetch subscriptions');
      }

      return data || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'fetch subscriptions');
    }
  }

  /**
   * Get subscription details by ID
   * @param id - Subscription ID
   * @returns Promise<SubscriptionDetails | null> - Subscription details or null if not found
   */
  async getSubscriptionById(id: string): Promise<SubscriptionDetails | null> {
    try {
      const { data, error } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw this.errorHandler.createApiError(
          error,
          `fetch subscription with id ${id}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(
        error,
        `fetch subscription with id ${id}`
      );
    }
  }

  /**
   * Get subscriptions by user ID
   * @param userId - User ID
   * @returns Promise<SubscriptionPreview[]> - List of user subscriptions
   */
  async getSubscriptionsByUserId(
    userId: string
  ): Promise<SubscriptionPreview[]> {
    try {
      const { data, error } = await this.supabase
        .from('subscriptions')
        .select(
          'id, user_id, plan_id, status, start_date, end_date, price, currency'
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw this.errorHandler.createApiError(
          error,
          `fetch subscriptions for user ${userId}`
        );
      }

      return data || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(
        error,
        `fetch subscriptions for user ${userId}`
      );
    }
  }

  /**
   * Get active subscription for a user
   * @param userId - User ID
   * @returns Promise<SubscriptionDetails | null> - Active subscription or null
   */
  async getActiveSubscription(
    userId: string
  ): Promise<SubscriptionDetails | null> {
    try {
      const { data, error } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', eSubscriptionStatus.ACTIVE)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw this.errorHandler.createApiError(
          error,
          `fetch active subscription for user ${userId}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(
        error,
        `fetch active subscription for user ${userId}`
      );
    }
  }

  /**
   * Create a new subscription
   * @param subscription - Subscription data to create
   * @returns Promise<Subscription> - Created subscription
   */
  async createSubscription(
    subscription: SubscriptionCreate
  ): Promise<Subscription> {
    try {
      const { data, error } = await this.supabase
        .from('subscriptions')
        .insert(subscription)
        .select()
        .single();

      if (error) {
        throw this.errorHandler.createApiError(error, 'create subscription');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'create subscription');
    }
  }

  /**
   * Update subscription by ID
   * @param id - Subscription ID
   * @param subscription - Subscription data to update
   * @returns Promise<Subscription> - Updated subscription
   */
  async updateSubscription(
    id: string,
    subscription: SubscriptionUpdate
  ): Promise<Subscription> {
    try {
      const { data, error } = await this.supabase
        .from('subscriptions')
        .update({
          ...subscription,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Subscription', id);
        }
        throw this.errorHandler.createApiError(
          error,
          `update subscription with id ${id}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(
        error,
        `update subscription with id ${id}`
      );
    }
  }

  /**
   * Cancel subscription by ID
   * @param id - Subscription ID
   * @returns Promise<Subscription> - Cancelled subscription
   */
  async cancelSubscription(id: string): Promise<Subscription> {
    try {
      const { data, error } = await this.supabase
        .from('subscriptions')
        .update({
          status: eSubscriptionStatus.CANCELLED,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Subscription', id);
        }
        throw this.errorHandler.createApiError(
          error,
          `cancel subscription with id ${id}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(
        error,
        `cancel subscription with id ${id}`
      );
    }
  }

  /**
   * Delete subscription by ID
   * @param id - Subscription ID
   * @returns Promise<void>
   */
  async deleteSubscription(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) {
        throw this.errorHandler.createApiError(
          error,
          `delete subscription with id ${id}`
        );
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(
        error,
        `delete subscription with id ${id}`
      );
    }
  }

  /**
   * Get subscriptions count
   * @param userId - Optional user ID to filter subscriptions
   * @param status - Optional status to filter subscriptions
   * @returns Promise<number> - Total count of subscriptions
   */
  async getSubscriptionsCount(
    userId?: string,
    status?: eSubscriptionStatus
  ): Promise<number> {
    try {
      let query = this.supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { count, error } = await query;

      if (error) {
        throw this.errorHandler.createApiError(error, 'count subscriptions');
      }

      return count || 0;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'count subscriptions');
    }
  }

  /**
   * Check if user has active subscription
   * @param userId - User ID
   * @returns Promise<boolean> - True if user has active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const activeSubscription = await this.getActiveSubscription(userId);
      return activeSubscription !== null;
    } catch (error) {
      this.errorHandler.handleError(
        error,
        `checking active subscription for user ${userId}`
      );
      return false;
    }
  }
}
