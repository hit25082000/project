import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  iPaymentIntent,
  iBillingHistory,
} from '../interfaces/payment.interface';
import {
  GlobalErrorHandler,
  ApiError,
} from '@core/errors/global-error-handler';

@Injectable({ providedIn: 'root' })
export class PaymentApi {
  private supabase = inject(SupabaseClient);
  private errorHandler = inject(GlobalErrorHandler);

  async createPaymentIntent(
    amount: number,
    currency = 'usd',
    metadata?: any
  ): Promise<iPaymentIntent> {
    try {
      const { data, error } = await this.supabase.functions.invoke('payments', {
        body: { action: 'create-intent', amount, currency, metadata },
      });

      if (error) {
        throw this.errorHandler.createApiError(error, 'create payment intent');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'create payment intent');
    }
  }

  async getBillingHistory(
    userId: string,
    limit = 20,
    offset = 0
  ): Promise<{ history: iBillingHistory[]; total: number }> {
    try {
      const { data, error, count } = await this.supabase
        .from('billing_history')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw this.errorHandler.createApiError(error, 'get billing history');
      }

      return {
        history: data || [],
        total: count || 0,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'get billing history');
    }
  }

  async processRefund(paymentId: string, amount?: number): Promise<void> {
    try {
      const { error } = await this.supabase.functions.invoke('payments', {
        body: { action: 'refund', paymentId, amount },
      });

      if (error) {
        throw this.errorHandler.createApiError(error, 'process refund');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'process refund');
    }
  }
}
